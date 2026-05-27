"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function AuthForm() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  console.log("Formulario enviado");

  try {
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    console.log("Resultado Supabase:", result);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    alert("Acceso correcto");
    window.location.assign("/wardrobe");
  } catch (error) {
    console.error("Error inesperado:", error);
    alert("Error inesperado al iniciar sesión");
  }
}

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <fieldset>
        <legend>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</legend>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

       <button type="submit" className="primary-btn">
        {mode === "login" ? "Ingresar" : "Registrarse"}
       </button>
      </fieldset>

      <div className="auth-switch">
        <p>{mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}</p>

        <button
          type="button"
          className="text-btn"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
        </button>
      </div>
    </form>
  );
}