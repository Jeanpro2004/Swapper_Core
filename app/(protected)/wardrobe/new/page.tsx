import GarmentForm from "@/components/garments/GarmentForm";
import { getAllStyles } from "@/models/style.model";

export default async function NewGarmentPage() {
  const { data: styles, error } = await getAllStyles();

  if (error) {
    return (
      <section className="page-section">
        <div className="container">
          <h1>Nueva prenda</h1>
          <p>No se pudieron cargar los estilos.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <h1>Nueva prenda</h1>
        <GarmentForm mode="create" styles={styles ?? []} />
      </div>
    </section>
  );
}