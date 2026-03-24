from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from io import BytesIO
import re

import cv2
import numpy as np
import pytesseract
from PIL import Image

from app.database import SessionLocal
from app import models

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─── Pydantic schemas ───────────────────────────────────────
class ProfileIn(BaseModel):
    name: str
    age: int
    gender: str
    occupation: str
    annual_income: float
    caste: Optional[str] = None
    residence: Optional[str] = None
    land_owned_hectares: Optional[float] = None
    bpl: Optional[bool] = False
    secc_listed: Optional[bool] = False
    bank_account: Optional[bool] = True
    education_level: Optional[str] = None

# ─── Eligibility Engine ─────────────────────────────────────
def check_eligibility(profile: dict, rules: dict):
    reasons = []
    passed = []

    for field, value in rules.items():
        user_val = profile.get(field)

        if user_val is None:
            continue

        if field == "age_min" and profile.get("age") is not None:
            if profile["age"] >= value:
                passed.append(f"Age {profile['age']} >= {value} ✓")
            else:
                reasons.append(f"Age must be at least {value}")

        elif field == "age_max" and profile.get("age") is not None:
            if profile["age"] <= value:
                passed.append(f"Age {profile['age']} <= {value} ✓")
            else:
                reasons.append(f"Age must be at most {value}")

        elif field == "annual_income_max":
            if profile.get("annual_income", 999999999) <= value:
                passed.append(f"Income within limit ✓")
            else:
                reasons.append(f"Income exceeds limit of ₹{value:,}")

        elif field == "occupation":
            if isinstance(value, list):
                if profile.get("occupation") in value:
                    passed.append(f"Occupation matches ✓")
                else:
                    reasons.append(f"Occupation must be one of {value}")
            else:
                if profile.get("occupation") == value:
                    passed.append(f"Occupation matches ✓")
                else:
                    reasons.append(f"Must be a {value}")

        elif field == "residence":
            if profile.get("residence") == value:
                passed.append(f"Residence matches ✓")
            else:
                reasons.append(f"Must be {value} resident")

        elif field == "bpl":
            if profile.get("bpl") == value:
                passed.append("BPL status matches ✓")
            else:
                reasons.append("Must be BPL category")

    eligible = len(reasons) == 0
    return {"eligible": eligible, "passed": passed, "failed_reasons": reasons}


def detect_document_type(text: str) -> str:
    normalized = text.lower()

    if re.search(r"\b\d{4}\s?\d{4}\s?\d{4}\b|aadhaar|uidai", normalized):
        return "aadhaar"
    if re.search(r"\b[a-z]{5}\d{4}[a-z]\b|permanent account number|income tax department", normalized):
        return "pan"
    if re.search(r"income certificate|annual income|income\s+slip|salary\s+certificate", normalized):
        return "income_cert"
    if re.search(r"caste certificate|scheduled caste|scheduled tribe|other backward", normalized):
        return "caste_cert"
    if re.search(r"ration card|nfsa|bpl|aph|phh|aay", normalized):
        return "ration_card"

    return "unknown"


def find_regex(pattern: str, text: str, flags: int = 0, group: int = 1):
    match = re.search(pattern, text, flags)
    if not match:
        return None
    value = match.group(group).strip()
    return value if value else None


def extract_address(text: str):
    address_block = re.search(
        r"(?:ADDRESS|Address|पता)\s*[:\-]\s*(.+?)(?=\n\s*(?:DOB|Date\s*of\s*Birth|Gender|Sex|PIN|Pincode|VALID|Valid|Expiry|$))",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not address_block:
        return None
    cleaned = re.sub(r"\n{2,}", "\n", address_block.group(1)).strip()
    return cleaned if cleaned else None


def extract_document_fields(text: str) -> dict:
    fields = {
        "full_name": None,
        "aadhaar_number": None,
        "pan_number": None,
        "date_of_birth": None,
        "gender": None,
        "address": None,
        "income_amount": None,
        "caste_category": None,
        "bpl_number": None,
        "validity_date": None,
    }

    fields["full_name"] = find_regex(
        r"(?:NAME|Name|नाम)\s*[:\-]\s*([A-Za-z\u0900-\u097F\s\.]{3,})",
        text,
        flags=re.IGNORECASE,
    )

    aadhaar = find_regex(r"\b(\d{4}\s\d{4}\s\d{4})\b", text)
    if aadhaar is None:
        compact_aadhaar = find_regex(r"\b(\d{12})\b", text)
        if compact_aadhaar:
            aadhaar = f"{compact_aadhaar[0:4]} {compact_aadhaar[4:8]} {compact_aadhaar[8:12]}"
    fields["aadhaar_number"] = aadhaar

    fields["pan_number"] = find_regex(r"\b([A-Z]{5}\d{4}[A-Z])\b", text)
    fields["date_of_birth"] = find_regex(r"\b(\d{2}/\d{2}/\d{4})\b", text)
    fields["gender"] = find_regex(r"\b(Male|Female|पुरुष|महिला)\b", text, flags=re.IGNORECASE)
    fields["address"] = extract_address(text)

    fields["income_amount"] = find_regex(
        r"(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)",
        text,
        flags=re.IGNORECASE,
    )

    fields["caste_category"] = find_regex(
        r"\b(SC|ST|OBC|General)\b",
        text,
        flags=re.IGNORECASE,
    )

    fields["bpl_number"] = find_regex(
        r"(?:BPL(?:\s*(?:No\.?|Number|Card))?)\s*[:\-]?\s*([A-Z0-9\-/]{5,})",
        text,
        flags=re.IGNORECASE,
    )

    fields["validity_date"] = find_regex(
        r"(?:VALID\s*UPTO|EXPIRY|Valid\s*Till|Validity)\s*[:\-]?\s*(\d{2}/\d{2}/\d{4})",
        text,
        flags=re.IGNORECASE,
    )

    return fields

# ─── Routes ─────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Backend connected"}

@app.get("/schemes")
def get_all_schemes(db: Session = Depends(get_db)):
    schemes = db.query(models.Scheme).all()
    return [
        {
            "id": s.id,
            "scheme_name": s.scheme_name,
            "ministry": s.ministry,
            "category": s.category,
            "benefit_description": s.benefit_description,
            "apply_link": s.apply_link,
            "state": s.state,
        }
        for s in schemes
    ]

@app.get("/schemes/{scheme_id}")
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    rules = db.query(models.EligibilityRule).filter_by(scheme_id=scheme_id).first()
    docs = db.query(models.Document).filter_by(scheme_id=scheme_id).all()
    return {
        "id": scheme.id,
        "scheme_name": scheme.scheme_name,
        "ministry": scheme.ministry,
        "category": scheme.category,
        "benefit_description": scheme.benefit_description,
        "apply_link": scheme.apply_link,
        "eligibility_rules": rules.rule_json if rules else {},
        "documents": [d.document_name for d in docs],
    }

@app.post("/profile")
def save_profile(profile: ProfileIn, db: Session = Depends(get_db)):
    p = models.UserProfile(
        name=profile.name,
        age=profile.age,
        gender=profile.gender,
        occupation=profile.occupation,
        annual_income=profile.annual_income,
        caste=profile.caste,
        residence=profile.residence,
        land_owned_hectares=profile.land_owned_hectares,
        bpl=profile.bpl,
        secc_listed=profile.secc_listed,
        bank_account=profile.bank_account,
        education_level=profile.education_level,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"profile_id": p.id, "message": "Profile saved"}

@app.post("/recommend")
def recommend_schemes(profile: ProfileIn, db: Session = Depends(get_db)):
    schemes = db.query(models.Scheme).all()
    profile_dict = profile.dict()
    results = []

    for scheme in schemes:
        rules_obj = db.query(models.EligibilityRule).filter_by(scheme_id=scheme.id).first()
        docs = db.query(models.Document).filter_by(scheme_id=scheme.id).all()
        rules = rules_obj.rule_json if rules_obj else {}

        eligibility = check_eligibility(profile_dict, rules)

        results.append({
            "id": scheme.id,
            "scheme_name": scheme.scheme_name,
            "category": scheme.category,
            "benefit_description": scheme.benefit_description,
            "apply_link": scheme.apply_link,
            "eligible": eligibility["eligible"],
            "passed_checks": eligibility["passed"],
            "failed_reasons": eligibility["failed_reasons"],
            "documents": [d.document_name for d in docs],
        })

    results.sort(key=lambda x: x["eligible"], reverse=True)
    return {"total": len(results), "schemes": results}


@app.post("/extract-document")
async def extract_document(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        pil_image = Image.open(BytesIO(image_bytes)).convert("RGB")
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Unable to read image: {exc}")

    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
    denoised = cv2.medianBlur(gray, 3)
    processed = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    try:
        ocr_text = pytesseract.image_to_string(processed, lang="eng+hin")
    except pytesseract.TesseractNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="Tesseract OCR is not installed or not available in PATH",
        )
    document_type = detect_document_type(ocr_text)
    fields = extract_document_fields(ocr_text)

    return {
        "document_type": document_type,
        "full_name": fields["full_name"],
        "aadhaar_number": fields["aadhaar_number"],
        "pan_number": fields["pan_number"],
        "date_of_birth": fields["date_of_birth"],
        "gender": fields["gender"],
        "address": fields["address"],
        "income_amount": fields["income_amount"],
        "caste_category": fields["caste_category"],
        "bpl_number": fields["bpl_number"],
        "validity_date": fields["validity_date"],
        "raw_text": ocr_text,
    }
