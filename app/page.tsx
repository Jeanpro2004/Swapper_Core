const steps = [
  {
    title: "Registra tus prendas",
    description:
      "Agrega prendas a tu armario digital con talla, marca, estado y estilo.",
  },
  {
    title: "Descubre prendas compatibles",
    description:
      "Explora prendas disponibles de otros usuarios dentro del feed.",
  },
  {
    title: "Marca interés",
    description:
      "Indica qué prendas te interesan para iniciar posibles intercambios.",
  },
  {
    title: "Genera matches",
    description:
      "Cuando existe interés mutuo, Swapper crea una oportunidad de intercambio.",
  },
  {
    title: "Construye tu Heritage",
    description:
      "Cada prenda registra eventos históricos como creación, match e intercambio.",
  },
  {
    title: "Recibe recomendaciones",
    description:
      "El sistema recomienda prendas según tu identidad de estilo y comportamiento.",
  },
];

const coreFeatures = [
  {
    title: "My Style Score",
    description:
      "Una puntuación que representa tu identidad dinámica de estilo.",
  },
  {
    title: "Curated Heritage",
    description:
      "Un historial que muestra el recorrido de tus prendas dentro de Swapper.",
  },
  {
    title: "Recomendaciones inteligentes",
    description:
      "Sugerencias basadas en tu armario, estilo dominante e historial.",
  },
];

export default function HomePage() {
  return (
    <main className="page-section">
      <div className="container">
        <section className="home-hero" aria-labelledby="home-title">
          <p className="eyebrow">Swapper · Heritage & Style Engine</p>

          <h1 id="home-title">
            Intercambia prendas. Construye tu identidad de estilo.
          </h1>

          <p className="home-hero-description">
            Swapper es una aplicación web para intercambiar prendas de segunda
            mano sin dinero. Su core analiza tu armario, tus interacciones y tu
            historial para construir una identidad dinámica de estilo y generar
            mejores oportunidades de intercambio.
          </p>
        </section>

        <section className="info-card" aria-labelledby="how-it-works-title">
          <h2 id="how-it-works-title">Cómo funciona Swapper</h2>

          <div className="card-grid">
            {steps.map((step, index) => (
              <article className="info-card" key={step.title}>
                <p className="step-number">Paso {index + 1}</p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="info-card" aria-labelledby="core-title">
          <h2 id="core-title">El core: Heritage & Style Engine</h2>

          <p>
            El núcleo de Swapper convierte la interacción entre usuarios y
            prendas en datos útiles para entender estilo, confianza y
            compatibilidad.
          </p>

          <div className="card-grid">
            {coreFeatures.map((feature) => (
              <article className="info-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}