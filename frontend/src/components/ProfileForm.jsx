import { useState } from "react";
import { getRecommendations } from "../api";

const steps = ["Personal", "Economic", "Documents", "Find Schemes"];

export default function ProfileForm({ onResults }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Personal
    name: "", age: "", gender: "male", residence: "rural",
    state: "", district: "",
    // Economic
    occupation: "farmer", annual_income: "", caste: "General",
    land_owned_hectares: "", bpl: false, secc_listed: false,
    bank_account: true, education_level: "class 10 pass",
    // Documents (file names only for display)
    aadhaar_number: "", ration_card: "", income_cert: false,
    caste_cert: false, land_record: false, bank_passbook: false,
  });

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: form.name, age: parseInt(form.age), gender: form.gender,
        occupation: form.occupation,
        annual_income: parseFloat(form.annual_income) || 0,
        caste: form.caste, residence: form.residence,
        land_owned_hectares: parseFloat(form.land_owned_hectares) || 0,
        bpl: form.bpl, secc_listed: form.secc_listed,
        bank_account: form.bank_account, education_level: form.education_level,
      };
      const data = await getRecommendations(payload);
      onResults(data.schemes);
    } catch (err) {
      alert("Error connecting to server. Make sure backend is running.");
    }
    setLoading(false);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .pf-wrap { font-family: 'DM Sans', sans-serif; background: #f0f4ff; min-height: 100vh; padding: 32px 16px; }
    .pf-card { background: white; max-width: 680px; margin: 0 auto; border-radius: 20px; box-shadow: 0 8px 40px rgba(30,50,120,0.10); overflow: hidden; }
    .pf-header { background: linear-gradient(135deg, #1a237e 0%, #283593 60%, #3949ab 100%); padding: 32px 36px 24px; color: white; }
    .pf-header h1 { font-family: 'Noto Serif', serif; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    .pf-header p { opacity: 0.8; font-size: 14px; margin-top: 6px; }
    .pf-steps { display: flex; gap: 0; padding: 0 36px; background: #1a237e; }
    .pf-step { flex: 1; text-align: center; padding: 12px 4px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); border-bottom: 3px solid transparent; cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px; text-transform: uppercase; }
    .pf-step.active { color: white; border-bottom-color: #90caf9; }
    .pf-step.done { color: #90caf9; border-bottom-color: #42a5f5; }
    .pf-body { padding: 32px 36px; }
    .pf-section-title { font-family: 'Noto Serif', serif; font-size: 18px; color: #1a237e; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .pf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .pf-field { display: flex; flex-direction: column; gap: 6px; }
    .pf-field.full { grid-column: 1 / -1; }
    .pf-label { font-size: 12px; font-weight: 600; color: #5c6bc0; text-transform: uppercase; letter-spacing: 0.8px; }
    .pf-input { padding: 11px 14px; border: 1.5px solid #e0e0e0; border-radius: 10px; font-size: 15px; font-family: 'DM Sans', sans-serif; color: #1a237e; background: #fafbff; transition: border 0.2s; outline: none; }
    .pf-input:focus { border-color: #3949ab; background: white; box-shadow: 0 0 0 3px rgba(57,73,171,0.08); }
    .pf-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%233949ab' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }
    .pf-checks { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
    .pf-check { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1.5px solid #e8eaf6; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .pf-check:hover { border-color: #3949ab; background: #f3f4ff; }
    .pf-check input { width: 18px; height: 18px; accent-color: #3949ab; cursor: pointer; }
    .pf-check-label { font-size: 14px; color: #333; }
    .pf-check-desc { font-size: 12px; color: #888; }
    .pf-doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
    .pf-doc-item { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border: 1.5px solid #e8eaf6; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .pf-doc-item:hover { border-color: #3949ab; background: #f3f4ff; }
    .pf-doc-item.checked { border-color: #3949ab; background: #eef0ff; }
    .pf-doc-icon { font-size: 22px; }
    .pf-doc-name { font-size: 13px; font-weight: 600; color: #1a237e; }
    .pf-doc-sub { font-size: 11px; color: #888; }
    .pf-doc-item input { accent-color: #3949ab; width: 16px; height: 16px; margin-left: auto; }
    .pf-actions { display: flex; gap: 12px; margin-top: 28px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
    .pf-btn { flex: 1; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
    .pf-btn-back { background: #f3f4ff; color: #3949ab; border: 1.5px solid #c5cae9; }
    .pf-btn-back:hover { background: #e8eaf6; }
    .pf-btn-next { background: linear-gradient(135deg, #1a237e, #3949ab); color: white; box-shadow: 0 4px 15px rgba(57,73,171,0.3); }
    .pf-btn-next:hover { box-shadow: 0 6px 20px rgba(57,73,171,0.4); transform: translateY(-1px); }
    .pf-btn-next:disabled { background: #b0bec5; box-shadow: none; transform: none; cursor: not-allowed; }
    .pf-aadhaar { background: linear-gradient(135deg, #1a237e, #283593); color: white; border-radius: 14px; padding: 20px; margin-bottom: 20px; }
    .pf-aadhaar-title { font-size: 13px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
    .pf-aadhaar input { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: white; width: 100%; padding: 10px 14px; border-radius: 8px; font-size: 18px; letter-spacing: 4px; margin-top: 8px; outline: none; font-family: monospace; }
    .pf-aadhaar input::placeholder { color: rgba(255,255,255,0.4); letter-spacing: 2px; }
    .pf-info { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #2e7d32; margin-bottom: 16px; }
    @media (max-width: 600px) { .pf-grid { grid-template-columns: 1fr; } .pf-doc-grid { grid-template-columns: 1fr; } .pf-body { padding: 24px 20px; } .pf-header { padding: 24px 20px; } }
  `;

  const indianStates = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

  return (
    <div className="pf-wrap">
      <style>{css}</style>
      <div className="pf-card">
        <div className="pf-header">
          <h1>🏛️ Scheme Eligibility Finder</h1>
          <p>Fill in your details to discover government schemes you qualify for</p>
        </div>

        <div className="pf-steps">
          {steps.map((s, i) => (
            <div key={i} className={`pf-step ${i === step ? "active" : i < step ? "done" : ""}`}>
              {i < step ? "✓ " : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        <div className="pf-body">

          {/* Step 0: Personal */}
          {step === 0 && (
            <>
              <div className="pf-section-title">👤 Personal Information</div>
              <div className="pf-info">This information is used to match you with relevant government schemes.</div>
              <div className="pf-grid">
                <div className="pf-field full">
                  <label className="pf-label">Full Name (as per Aadhaar)</label>
                  <input className="pf-input" name="name" value={form.name} onChange={set} placeholder="Enter your full name" />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Age</label>
                  <input className="pf-input" name="age" type="number" value={form.age} onChange={set} placeholder="Your age" min="1" max="120" />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Gender</label>
                  <select className="pf-input pf-select" name="gender" value={form.gender} onChange={set}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Transgender</option>
                  </select>
                </div>
                <div className="pf-field">
                  <label className="pf-label">State</label>
                  <select className="pf-input pf-select" name="state" value={form.state} onChange={set}>
                    <option value="">Select State</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="pf-field">
                  <label className="pf-label">District</label>
                  <input className="pf-input" name="district" value={form.district} onChange={set} placeholder="Your district" />
                </div>
                <div className="pf-field full">
                  <label className="pf-label">Area of Residence</label>
                  <select className="pf-input pf-select" name="residence" value={form.residence} onChange={set}>
                    <option value="rural">Rural (Village / Gram Panchayat)</option>
                    <option value="urban">Urban (City / Town / Municipality)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 1: Economic */}
          {step === 1 && (
            <>
              <div className="pf-section-title">💰 Economic & Social Profile</div>
              <div className="pf-grid">
                <div className="pf-field">
                  <label className="pf-label">Occupation</label>
                  <select className="pf-input pf-select" name="occupation" value={form.occupation} onChange={set}>
                    <option value="farmer">Farmer / Agriculturist</option>
                    <option value="tenant farmer">Tenant Farmer / Sharecropper</option>
                    <option value="traditional artisan">Traditional Artisan / Craftsperson</option>
                    <option value="self-employed">Self Employed / Small Business</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed / Job Seeker</option>
                    <option value="salaried">Salaried / Government Employee</option>
                  </select>
                </div>
                <div className="pf-field">
                  <label className="pf-label">Annual Family Income (₹)</label>
                  <input className="pf-input" name="annual_income" type="number" value={form.annual_income} onChange={set} placeholder="e.g. 120000" />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Caste Category</label>
                  <select className="pf-input pf-select" name="caste" value={form.caste} onChange={set}>
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>
                <div className="pf-field">
                  <label className="pf-label">Education Level</label>
                  <select className="pf-input pf-select" name="education_level" value={form.education_level} onChange={set}>
                    <option value="illiterate">Illiterate / No Schooling</option>
                    <option value="school dropout">School Dropout (Below Class 10)</option>
                    <option value="class 10 pass">Class 10 Pass (Matric)</option>
                    <option value="post-matric">Post Matric (Class 12 / Diploma)</option>
                    <option value="professional/technical">Graduate / Professional / Technical</option>
                  </select>
                </div>
                <div className="pf-field">
                  <label className="pf-label">Land Owned (in Hectares)</label>
                  <input className="pf-input" name="land_owned_hectares" type="number" step="0.1" value={form.land_owned_hectares} onChange={set} placeholder="0 if none" />
                </div>
              </div>

              <div style={{marginTop: 20}}>
                <label className="pf-label" style={{display:"block", marginBottom:12}}>Social Status</label>
                <div className="pf-checks">
                  <label className="pf-check">
                    <input type="checkbox" name="bpl" checked={form.bpl} onChange={set} />
                    <div>
                      <div className="pf-check-label">BPL — Below Poverty Line</div>
                      <div className="pf-check-desc">You have a BPL ration card or certificate</div>
                    </div>
                  </label>
                  <label className="pf-check">
                    <input type="checkbox" name="secc_listed" checked={form.secc_listed} onChange={set} />
                    <div>
                      <div className="pf-check-label">SECC Listed</div>
                      <div className="pf-check-desc">Your family is listed in Socio-Economic Caste Census data</div>
                    </div>
                  </label>
                  <label className="pf-check">
                    <input type="checkbox" name="bank_account" checked={form.bank_account} onChange={set} />
                    <div>
                      <div className="pf-check-label">Has Bank Account</div>
                      <div className="pf-check-desc">You have an active bank / post office account</div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <>
              <div className="pf-section-title">📄 Available Documents</div>
              <p style={{fontSize:13, color:"#666", marginBottom:16}}>Select the documents you currently have. This helps us show schemes you can apply for right now.</p>

              <div className="pf-aadhaar">
                <div className="pf-aadhaar-title">Aadhaar Card Number</div>
                <input name="aadhaar_number" value={form.aadhaar_number} onChange={set} placeholder="XXXX XXXX XXXX" maxLength={14} />
              </div>

              <div className="pf-doc-grid">
                {[
                  { name: "income_cert", icon: "📋", label: "Income Certificate", sub: "Issued by tehsildar/revenue office" },
                  { name: "caste_cert", icon: "🏷️", label: "Caste Certificate", sub: "SC/ST/OBC certificate" },
                  { name: "land_record", icon: "🌾", label: "Land Record / Khasra", sub: "Patta / RoR / 7-12 extract" },
                  { name: "bank_passbook", icon: "🏦", label: "Bank Passbook", sub: "Savings / Jan Dhan account" },
                  { name: "ration_card", icon: "🎴", label: "Ration Card", sub: "BPL / APL / PHH ration card" },
                ].map(doc => (
                  <label key={doc.name} className={`pf-doc-item ${form[doc.name] ? "checked" : ""}`}>
                    <span className="pf-doc-icon">{doc.icon}</span>
                    <div>
                      <div className="pf-doc-name">{doc.label}</div>
                      <div className="pf-doc-sub">{doc.sub}</div>
                    </div>
                    <input type="checkbox" name={doc.name} checked={!!form[doc.name]} onChange={set} />
                  </label>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <>
              <div className="pf-section-title">✅ Confirm & Find Schemes</div>
              <div style={{background:"#f3f4ff", borderRadius:12, padding:20, marginBottom:16}}>
                {[
                  ["Name", form.name], ["Age", form.age], ["Gender", form.gender],
                  ["State", form.state || "Not specified"], ["Residence", form.residence],
                  ["Occupation", form.occupation], ["Annual Income", form.annual_income ? `₹${Number(form.annual_income).toLocaleString()}` : "Not specified"],
                  ["Caste", form.caste], ["Education", form.education_level],
                  ["BPL", form.bpl ? "Yes" : "No"], ["Bank Account", form.bank_account ? "Yes" : "No"],
                ].map(([k, v]) => (
                  <div key={k} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #e8eaf6", fontSize:14}}>
                    <span style={{color:"#5c6bc0", fontWeight:600}}>{k}</span>
                    <span style={{color:"#1a237e"}}>{v}</span>
                  </div>
                ))}
              </div>
              <p style={{fontSize:13, color:"#888", textAlign:"center"}}>Our AI will match your profile against all government schemes and show you eligible ones with detailed reasoning.</p>
            </>
          )}

          <div className="pf-actions">
            {step > 0 && (
              <button className="pf-btn pf-btn-back" onClick={() => setStep(s => s - 1)}>← Back</button>
            )}
            {step < 3 ? (
              <button className="pf-btn pf-btn-next" onClick={() => setStep(s => s + 1)}>
                Continue →
              </button>
            ) : (
              <button className="pf-btn pf-btn-next" onClick={submit} disabled={loading}>
                {loading ? "⏳ Analysing your profile..." : "🔍 Find My Eligible Schemes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}