import HeritageTimeline from "@/components/core/HeritageTimeline";

export default function HeritagePage() {
  return (
    <main className="page-section">
      <div className="container">
        <header className="page-header">
          <h1>Heritage</h1>
          <p>
            Revisa el recorrido histórico de tus prendas dentro de Swapper.
          </p>
        </header>

        <HeritageTimeline />
      </div>
    </main>
  );
}