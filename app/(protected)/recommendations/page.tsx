import StyleRecommendations from "@/components/core/StyleRecommendations";

export default function RecommendationsPage() {
  return (
    <main className="page-section">
      <div className="container">
        <header className="page-header">
          <h1>Recomendaciones</h1>
          <p>
            Descubre prendas compatibles con tu estilo dominante y preferencias
            actuales.
          </p>
        </header>

        <StyleRecommendations />
      </div>
    </main>
  );
}