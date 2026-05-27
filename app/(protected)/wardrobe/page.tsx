import Link from "next/link";
import WardrobeList from "@/components/garments/WardrobeList";

export default function WardrobePage() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Mi armario</h1>
        <p>Administra tus prendas registradas.</p>

        <Link href="/wardrobe/new" className="primary-btn">
          Nueva prenda
        </Link>

        <h2>Listado de prendas</h2>

        <WardrobeList />
      </div>
    </section>
  );
}