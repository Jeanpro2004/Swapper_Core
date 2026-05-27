import { getAllGarments } from "@/models/garment.model";

export default async function AdminGarmentsPage() {
  const { data: garments } = await getAllGarments();

  return (
    <section className="page-section">
      <div className="container">
        <h1>Vista global de prendas</h1>
        <p>Listado administrativo de todas las prendas registradas.</p>

        <div className="card-grid">
          {(garments ?? []).map((garment) => (
            <article className="info-card" key={garment.id}>
              <h3>{garment.title}</h3>
              <p>{garment.description || "Sin descripción"}</p>
              <p><strong>Talla:</strong> {garment.size}</p>
              <p><strong>Marca:</strong> {garment.brand || "No especificada"}</p>
              <p><strong>Estado:</strong> {garment.condition}</p>
              <p><strong>Owner ID:</strong> {garment.owner_id || "Sin dueño"}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}