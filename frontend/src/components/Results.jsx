export default function Results({ results, onBack, onSelect }) {
  const eligible = results.filter(s => s.eligible);
  const others = results.filter(s => !s.eligible);

  const Card = ({ scheme }) => (
    <div onClick={() => onSelect(scheme)} style={{
      border: `2px solid ${scheme.eligible ? "#4caf50" : "#ff9800"}`,
      borderRadius: 10, padding: 16, marginBottom: 12,
      cursor: "pointer", background: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, color: "#1a237e", fontSize: 16 }}>{scheme.scheme_name}</h3>
        <span style={{
          background: scheme.eligible ? "#e8f5e9" : "#fff3e0",
          color: scheme.eligible ? "#2e7d32" : "#e65100",
          padding: "4px 10px", borderRadius: 20, fontSize: 13, fontWeight: 700
        }}>
          {scheme.eligible ? "✅ Eligible" : "⚠️ Not Eligible"}
        </span>
      </div>
      <p style={{ color: "#555", margin: "8px 0 4px", fontSize: 14 }}>{scheme.benefit_description}</p>
      <span style={{ background: "#e3f2fd", color: "#1565c0", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>{scheme.category}</span>
      {scheme.failed_reasons?.length > 0 && (
        <p style={{ color: "#c62828", fontSize: 13, marginTop: 8 }}>
          ❌ {scheme.failed_reasons.join(" | ")}
        </p>
      )}
    </div>
  );

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "1px solid #1a237e", color: "#1a237e", padding: "8px 16px", borderRadius: 6, cursor: "pointer", marginBottom: 16 }}>← Back</button>
      <h2 style={{ color: "#1a237e" }}>📊 Your Results</h2>
      <p style={{ color: "#555" }}><strong>{eligible.length}</strong> eligible schemes found out of {results.length} total</p>

      {eligible.length > 0 && (<><h3 style={{ color: "#2e7d32" }}>✅ Eligible Schemes ({eligible.length})</h3>{eligible.map(s => <Card key={s.id} scheme={s} />)}</>)}
      {others.length > 0 && (<><h3 style={{ color: "#e65100", marginTop: 24 }}>⚠️ Not Eligible ({others.length})</h3>{others.map(s => <Card key={s.id} scheme={s} />)}</>)}
    </div>
  );
}