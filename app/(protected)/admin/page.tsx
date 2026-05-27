import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Admin Core</h1>

        <p>
          Panel de administración del core aprobado:
          Heritage & Style Engine.
        </p>

        <div className="card-grid">
          <article className="info-card">
            <h2>Gestión de estilos</h2>

            <p>
              Los estilos se cargan desde la tabla styles
              y se usan como relación en las prendas
              mediante style_id.
            </p>
          </article>

          <article className="info-card">
            <h2>Validación Back-End</h2>

            <p>
              El sistema valida datos críticos del core
              antes de guardar en la base de datos.
            </p>
          </article>

          <article className="info-card">
            <h2>Relación entre tablas</h2>

            <p>
              La clave foránea style_id no se ingresa
              manualmente. Se selecciona desde un
              dropdown dinámico.
            </p>
          </article>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Link href="/wardrobe/new" className="primary-btn">
            Registrar prenda con estilo
          </Link>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <Link href="/admin/garments" className="primary-btn">
            Ver prendas globales
          </Link>
        </div>
      </div>
    </section>
  );
}