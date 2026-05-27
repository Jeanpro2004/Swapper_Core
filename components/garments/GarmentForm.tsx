"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Garment } from "@/types/garment";
import { Style } from "@/types/style";
import { createClient } from "@/lib/supabase/browser";

type GarmentFormProps = {
  initialData?: Garment;
  mode?: "create" | "edit";
  styles: Style[];
};

export default function GarmentForm({
  initialData,
  mode = "create",
  styles = [],
}: GarmentFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    size: initialData?.size || "",
    brand: initialData?.brand || "",
    condition: initialData?.condition || "",
    style_id: initialData?.style_id || "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      alert("Usuario no autenticado.");
      setLoading(false);
      return;
    }

    const endpoint =
      mode === "create"
        ? "/api/garments"
        : `/api/garments/${initialData?.id}`;

    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || "Ocurrió un error");
      return;
    }

    router.push("/wardrobe");
    router.refresh();
  }

  return (
    <form className="garment-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>
          {mode === "create" ? "Registrar prenda" : "Editar prenda"}
        </legend>

        <div className="form-group">
          <label htmlFor="title">Nombre</label>
          <input
            id="title"
            type="text"
            placeholder="Chaqueta denim"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe la prenda"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="size">Talla</label>
          <select
            id="size"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            required
          >
            <option value="">Selecciona una talla</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Marca</label>
          <input
            id="brand"
            type="text"
            placeholder="Zara"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="style">Estilo</label>
          <select
            id="style"
            value={form.style_id}
            onChange={(e) =>
              setForm({ ...form, style_id: e.target.value })
            }
            required
          >
            <option value="">Selecciona un estilo</option>

            {styles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="condition">Estado</label>
          <select
            id="condition"
            value={form.condition}
            onChange={(e) =>
              setForm({ ...form, condition: e.target.value })
            }
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="new">Nuevo</option>
            <option value="almost_new">Casi nuevo</option>
            <option value="used">Usado</option>
          </select>
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading
            ? "Guardando..."
            : mode === "create"
            ? "Guardar"
            : "Actualizar"}
        </button>
      </fieldset>
    </form>
  );
}