# Swapper - Heritage & Style Engine

Swapper es una plataforma web desarrollada con Next.js + Supabase enfocada en la gestión inteligente de prendas y estilos personales.

El sistema implementa autenticación, roles de usuario, ownership de datos, relaciones entre tablas y validaciones críticas en Back-End bajo una arquitectura MVC.

---

# Tecnologías utilizadas

- Next.js 16
- TypeScript
- Supabase
- PostgreSQL
- App Router
- MVC Architecture
- Git & GitHub

---

# Funcionalidades principales

## Autenticación

- Registro e inicio de sesión con Supabase Auth
- Persistencia de sesión
- Logout seguro

---

## Roles y jerarquías

El sistema maneja dos jerarquías:

### Usuario normal
Puede:
- Registrar prendas
- Editar sus prendas
- Eliminar sus prendas
- Ver únicamente su armario personal

### Admin
Puede:
- Acceder al módulo Admin Core
- Gestionar funcionalidades críticas del core
- Visualizar herramientas administrativas

---

# Ownership de datos

Cada prenda queda asociada al usuario autenticado mediante:

```sql
owner_id
```

Esto permite:

- Separación individual de datos
- Seguridad multiusuario
- Armarios privados por cuenta

Los usuarios no pueden visualizar ni modificar prendas de otros usuarios.

---

# Arquitectura MVC

El proyecto fue desarrollado utilizando el patrón MVC:

## Models

Responsables de la comunicación con Supabase y acceso a datos.

## Controllers

Manejan:

- lógica de negocio
- validaciones
- autenticación
- ownership

## Views / Components

Interfaz de usuario desarrollada con React y Next.js.

---

# Relación entre tablas

El sistema implementa relaciones reales entre tablas.

## Tabla garments

Contiene las prendas registradas.

## Tabla styles

Contiene los estilos disponibles.

Cada prenda utiliza una clave foránea:

```sql
style_id
```

---

# Uso de Dropdown dinámico

El usuario NO ingresa manualmente la clave foránea.

El sistema:

1. consulta los estilos desde la tabla `styles`
2. carga dinámicamente un dropdown
3. permite seleccionar el estilo correspondiente

Esto cumple correctamente con el requisito de relación entre tablas.

---

# Validaciones Back-End

El sistema implementa validaciones críticas en Back-End antes de guardar datos sensibles del core.

## Ejemplos

- Validación de autenticación del usuario
- Validación de ownership
- Validación de `style_id`
- Validación de campos requeridos
- Protección contra inserciones inválidas

Estas validaciones NO dependen únicamente de JavaScript del Front-End.

---

# Admin Core

El módulo Admin Core incluye:

- Gestión de estilos
- Validaciones críticas del sistema
- Relación entre tablas
- Core protegido mediante roles

El acceso está restringido únicamente a usuarios con:

```txt
role = admin
```

---

# Estructura del proyecto

```txt
app/
 ├── api/
 ├── (protected)/
 ├── (public)/

components/
 ├── auth/
 ├── garments/

controllers/
models/
services/
lib/
```

---

# Deploy

Proyecto deployado con:

- Vercel
- Supabase

---

# Instalación local

## 1. Clonar repositorio

```bash
git clone <repo-url>
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar variables de entorno

Crear archivo `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 4. Ejecutar proyecto

```bash
npm run dev
```

---

# Autor

Proyecto académico desarrollado por Jean Paul Rodriguez.
