export default function SchemeDetail({ scheme, onBack }) {
  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "1px solid #1a237e", color: "#1a237e", padding: "8px 16px", borderRadius: 6, cursor: "pointer", marginBottom: 16 }}>← Back to Results</button>

      <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h2 style={{ color: "#1a237e", margin: 0 }}>{scheme.scheme_name}</h2>
          <span style={{ background: scheme.eligible ? "#e8f5e9" : "#fff3e0", color: scheme.eligible ? "#2e7d32" : "#e65100", padding: "6px 14px", borderRadius: 20, fontWeight: 700 }}>
            {scheme.eligible ? "✅ You are Eligible" : "⚠️ Not Eligible"}
          </span>
        </div>

        <span style={{ background: "#e3f2fd", color: "#1565c0", padding: "3px 10px", borderRadius: 12, fontSize: 13 }}>{scheme.category}</span>

        <h3 style={{ color: "#333", marginTop: 20 }}>💰 Benefit</h3>
        <p style={{ color: "#555" }}>{scheme.benefit_description}</p>

        {scheme.passed_checks?.length > 0 && (
          <><h3 style={{ color: "#2e7d32" }}>✅ Checks Passed</h3>
          <ul>{scheme.passed_checks.map((c, i) => <li key={i} style={{ color: "#2e7d32" }}>{c}</li>)}</ul></>
        )}

        {scheme.failed_reasons?.length > 0 && (
          <><h3 style={{ color: "#c62828" }}>❌ Why Not Eligible</h3>
          <ul>{scheme.failed_reasons.map((r, i) => <li key={i} style={{ color: "#c62828" }}>{r}</li>)}</ul></>
        )}

        <h3 style={{ color: "#333" }}>📄 Required Documents</h3>
        <ul>{scheme.documents?.map((d, i) => <li key={i} style={{ color: "#555", marginBottom: 4 }}>{d}</li>)}</ul>

        <a href={scheme.apply_link} target="_blank" rel="noreferrer"
          style={{ display: "inline-block", marginTop: 16, padding: "12px 28px", background: "#1a237e", color: "white", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
          🚀 Apply Now
        </a>
      </div>
    </div>
  );
}