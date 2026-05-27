import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="container">
        <article className="hero-card">
          <h1 id="hero-title">Swapper</h1>
          <p>
            Intercambia ropa de segunda mano con matches entre usuarios, sin dinero de por medio.
          </p>

          <div className="actions">
            <Link className="primary-btn" href="/auth">
              Crear cuenta / Iniciar sesión
            </Link>
          </div>
        </article>

        <section className="info-section" aria-labelledby="how-title">
          <h2 id="how-title">Cómo funciona</h2>
          <p>Base semántica lista para agregar CRUD, login y lógica de negocio.</p>

          <div className="card-grid">
            <article className="info-card">
              <h3>Sube una prenda</h3>
              <p>Registra foto, talla, marca, estado y descripción.</p>
            </article>

            <article className="info-card">
              <h3>Explora el feed</h3>
              <p>Descubre prendas de otros usuarios y da like a las que te interesen.</p>
            </article>

            <article className="info-card">
              <h3>Haz match</h3>
              <p>Si el interés es mutuo, se abre un chat para coordinar el intercambio.</p>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}