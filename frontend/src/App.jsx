import { useState } from "react";
import ProfileForm from "./components/ProfileForm";
import Results from "./components/Results";
import SchemeDetail from "./components/SchemeDetail";

export default function App() {
  const [page, setPage] = useState("home");
  const [results, setResults] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1 style={{ color: "#1a237e", borderBottom: "3px solid #1a237e", paddingBottom: 10 }}>
        🏛️ Government Scheme Finder
      </h1>
      <p style={{ color: "#555" }}>AI-powered welfare scheme recommendation system</p>

      {page === "home" && (
        <ProfileForm
          onResults={(data) => { setResults(data); setPage("results"); }}
        />
      )}

      {page === "results" && (
        <Results
          results={results}
          onBack={() => setPage("home")}
          onSelect={(scheme) => { setSelectedScheme(scheme); setPage("detail"); }}
        />
      )}

      {page === "detail" && (
        <SchemeDetail
          scheme={selectedScheme}
          onBack={() => setPage("results")}
        />
      )}
    </div>
  );
}