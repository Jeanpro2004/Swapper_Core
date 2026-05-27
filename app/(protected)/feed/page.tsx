import DiscoveryFeed from "@/components/core/DiscoveryFeed";

export default function FeedPage() {
  return (
    <main className="page-section">
      <div className="container">
        <header className="page-header">
          <h1>Feed</h1>
          <p>
            Descubre prendas registradas por otros usuarios y encuentra futuras
            oportunidades de intercambio.
          </p>
        </header>

        <DiscoveryFeed />
      </div>
    </main>
  );
}