import MatchesList from "@/components/core/MatchesList";

export default function MatchesPage() {
  return (
    <main className="page-section">
      <div className="container">
        <header className="page-header">
          <h1>Matches</h1>
          <p>
            Revisa las oportunidades de intercambio generadas por interés mutuo.
          </p>
        </header>

        <MatchesList />
      </div>
    </main>
  );
}