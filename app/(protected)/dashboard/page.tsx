import StyleProfileCard from "@/components/core/StyleProfileCard";

export default function DashboardPage() {
  return (
    <main className="page-section">
      <div className="container">
        <header className="page-header">
          <h1>Dashboard</h1>
          <p>
            Resumen inteligente de tu armario y tu identidad de estilo.
          </p>
        </header>

        <StyleProfileCard />
      </div>
    </main>
  );
}