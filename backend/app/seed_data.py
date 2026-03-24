from app.database import SessionLocal
from app import models

def seed():
    db = SessionLocal()
    
    schemes_data = [
        {"name": "PM Kisan Samman Nidhi", "ministry": "Ministry of Agriculture", "category": "Farmer Welfare", "benefit": "Rs 6000/year", "link": "https://pmkisan.gov.in", "rules": {"occupation": "farmer", "land_owned_hectares": "<=2"}, "docs": ["Aadhaar Card", "Land certificate", "Bank passbook"]},
        {"name": "Ayushman Bharat PM-JAY", "ministry": "Ministry of Health", "category": "Health", "benefit": "Rs 5 lakh health cover/year", "link": "https://pmjay.gov.in", "rules": {"family_income_category": "BPL"}, "docs": ["Aadhaar Card", "Ration card"]},
        {"name": "PM Awas Yojana (Urban)", "ministry": "Ministry of Housing", "category": "Housing", "benefit": "Subsidy up to Rs 2.67 lakh", "link": "https://pmaymis.gov.in", "rules": {"annual_income_max": 1800000, "house_ownership": "none"}, "docs": ["Aadhaar Card", "Income certificate"]},
        {"name": "MGNREGA", "ministry": "Ministry of Rural Development", "category": "Employment", "benefit": "100 days guaranteed employment", "link": "https://nrega.nic.in", "rules": {"residence": "rural", "age_min": 18}, "docs": ["Aadhaar Card", "Job card"]},
        {"name": "PM Mudra Yojana", "ministry": "Ministry of Finance", "category": "Business/MSME", "benefit": "Loans up to Rs 10 lakh", "link": "https://mudra.org.in", "rules": {"business_type": "self-employed"}, "docs": ["Aadhaar Card", "PAN Card", "Business proof"]},
    ]

    for s in schemes_data:
        scheme = models.Scheme(
            scheme_name=s["name"],
            ministry=s["ministry"],
            category=s["category"],
            benefit_description=s["benefit"],
            apply_link=s["link"],
            state="All"
        )
        db.add(scheme)
        db.flush()

        db.add(models.EligibilityRule(scheme_id=scheme.id, rule_json=s["rules"]))

        for doc in s["docs"]:
            db.add(models.Document(scheme_id=scheme.id, document_name=doc, required=True))

    db.commit()
    db.close()
    print(f"Seeded {len(schemes_data)} schemes successfully!")

if __name__ == "__main__":
    seed()