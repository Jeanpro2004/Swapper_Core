import CoreDashboard from "@/components/core/CoreDashboard";

export default function DashboardPage() {
  return (
    <main className="page-section">
      <div className="container">
        <header className="page-header">
          <h1>Dashboard</h1>
          <p>
            Resumen central del core de Swapper: armario, estilo, matches,
            heritage y oportunidades.
          </p>
        </header>

        <CoreDashboard />
      </div>
    </main>
  );
}