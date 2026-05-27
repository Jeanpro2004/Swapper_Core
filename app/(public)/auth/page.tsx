import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <div className="container auth-wrapper">
        <article className="auth-brand-panel">
          <h1>Swapper</h1>
          <p>
            Una plataforma para intercambiar ropa de segunda mano mediante matches.
          </p>
        </article>

        <article className="auth-form-panel">
          <h2 id="auth-title">Acceso</h2>
          <AuthForm />
        </article>
      </div>
    </section>
  );
}