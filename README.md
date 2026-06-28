# Swapper - Heritage & Style Engine

Swapper es una aplicación web desarrollada con **Next.js**, **TypeScript** y **Supabase**, enfocada en el intercambio inteligente de prendas de segunda mano sin uso de dinero.

El objetivo principal del sistema es permitir que los usuarios registren prendas, descubran prendas de otros usuarios, generen intereses, creen matches de intercambio y construyan una identidad digital de estilo mediante el core llamado **Heritage & Style Engine**.

---

---

# Tecnologías utilizadas

* Next.js 16
* TypeScript
* React
* Supabase Auth
* Supabase Database
* PostgreSQL
* App Router
* MVC Architecture
* Git & GitHub
* Vercel

---

# Objetivo del Core

El core de Swapper se basa en el **Heritage & Style Engine**, un núcleo que permite analizar el comportamiento del usuario y construir una identidad de estilo a partir de sus prendas, historial e interacciones.

El core trabaja con tres ideas principales:

1. **My Style Score**
   Calcula una puntuación dinámica de estilo basada en el armario, estilo dominante, heritage y matches.

2. **Curated Heritage**
   Registra eventos importantes de las prendas, como creación, generación de match, aceptación, cancelación o intercambio completado.

3. **Recomendaciones y sugerencias de estilo**
   Permite sugerir estilos compatibles con la identidad actual del usuario.

---

# Funcionalidades principales

## Autenticación

El sistema utiliza **Supabase Auth** para manejar:

* Registro de usuarios
* Inicio de sesión
* Cierre de sesión
* Persistencia de sesión
* Access token tipo JWT manejado por Supabase

El Front-End obtiene la sesión activa y envía el token al Back-End mediante el header:

```ts
Authorization: Bearer <access_token>
```

El Back-End valida el usuario autenticado antes de ejecutar operaciones críticas.

---

## Roles de usuario

El sistema maneja dos tipos de usuarios:

## Usuario normal

Puede:

* Registrar prendas
* Editar sus prendas
* Eliminar sus prendas
* Ver únicamente su armario personal
* Explorar el feed
* Marcar interés en prendas de otros usuarios
* Generar matches
* Consultar su Heritage
* Ver recomendaciones y Style Score

## Admin

Puede:

* Acceder al módulo Admin Core
* Gestionar estilos base
* Administrar información crítica del core

El acceso al módulo Admin está restringido a usuarios con:

```txt
role = admin
```

---

# Ownership de datos

Cada prenda registrada queda asociada al usuario autenticado mediante el campo:

```sql
owner_id
```

Esto permite:

* Separación de datos por usuario
* Armarios privados
* Seguridad multiusuario
* Protección contra edición o eliminación de prendas ajenas

El sistema valida en Back-End que un usuario solo pueda modificar sus propias prendas.

---

# Arquitectura MVC aplicada

El proyecto aplica una arquitectura tipo **MVC** adaptada a Next.js App Router.

## Models

Los modelos se encuentran en la carpeta:

```txt
models/
```

Responsabilidad:

* Acceso a datos
* Consultas a Supabase
* Inserciones, actualizaciones y eliminaciones
* Aislamiento de la base de datos frente a controladores y componentes

Ejemplos:

```txt
garment.model.ts
match.model.ts
core-dashboard.model.ts
heritage.model.ts
recommendation.model.ts
```

---

## Controllers

Los controladores se encuentran en:

```txt
controllers/
```

Responsabilidad:

* Recibir requests
* Validar autenticación
* Validar ownership
* Validar payloads
* Llamar a modelos o servicios
* Retornar respuestas HTTP

Ejemplos:

```txt
garment.controller.ts
match.controller.ts
core-dashboard.controller.ts
heritage.controller.ts
recommendation.controller.ts
```

---

## Services

Los servicios se encuentran en:

```txt
services/
```

Responsabilidad:

* Lógica de negocio
* Cálculos del core
* Reglas de intercambio
* Algoritmos de score
* Registro de eventos Heritage

Ejemplos:

```txt
core-dashboard.service.ts
style-score.service.ts
style-score-strategies.ts
match-engine.service.ts
garment-heritage.service.ts
style-recommendation.service.ts
```

---

## Views / Components

Los componentes se encuentran en:

```txt
components/
```

Responsabilidad:

* Interfaz visual
* Consumo de APIs internas
* Renderizado de información
* Manejo de estados del cliente

Ejemplos:

```txt
CoreDashboard.tsx
GarmentForm.tsx
DiscoveryFeed.tsx
MatchesList.tsx
HeritageTimeline.tsx
StyleRecommendations.tsx
```

---

# Estructura general del proyecto

```txt
app/
├── api/
│   ├── core/
│   └── garments/
├── (protected)/
│   ├── dashboard/
│   ├── wardrobe/
│   ├── feed/
│   ├── matches/
│   ├── heritage/
│   └── recommendations/
├── auth/
└── page.tsx

components/
├── auth/
├── core/
└── garments/

controllers/
├── core-dashboard.controller.ts
├── garment.controller.ts
├── match.controller.ts
└── recommendation.controller.ts

models/
├── core-dashboard.model.ts
├── garment.model.ts
├── match.model.ts
└── recommendation.model.ts

services/
├── core-dashboard.service.ts
├── style-score.service.ts
├── style-score-strategies.ts
├── match-engine.service.ts
└── garment-heritage.service.ts

types/
├── core-dashboard.ts
├── garment.ts
├── match.ts
└── heritage.ts

lib/
├── auth/
├── supabase/
└── validations/
```

---

# Flujo principal de la aplicación

## 1. Registro de prendas

El usuario registra una prenda desde el formulario del armario.

Flujo:

```txt
Usuario
→ GarmentForm
→ API /api/garments
→ garment.controller.ts
→ garment.model.ts
→ Supabase
```

El sistema valida:

* Usuario autenticado
* Campos requeridos
* Talla válida
* Estado válido
* Estilo válido
* Ownership

---

## 2. Feed de descubrimiento

El usuario puede explorar prendas disponibles de otros usuarios.

Flujo:

```txt
Usuario
→ DiscoveryFeed
→ API /api/core/feed
→ feed.controller.ts
→ feed.model.ts
→ Supabase
```

El feed excluye:

* Prendas propias
* Prendas no disponibles
* Prendas bloqueadas por matches activos

---

## 3. Intereses y Match Engine

Cuando un usuario marca interés en una prenda, el sistema valida si existe interés mutuo.

Flujo:

```txt
Usuario marca interés
→ garment-interest.controller.ts
→ garment-interest.model.ts
→ match-engine.service.ts
```

Si existe interés mutuo:

```txt
Se crea un match
→ Se bloquean ambas prendas
→ Se registra evento Heritage
```

---

## 4. Gestión de matches

Los matches pueden cambiar de estado:

```txt
pending
accepted
rejected
cancelled
completed
```

Reglas principales:

```txt
pending → accepted
pending → rejected
pending → cancelled
accepted → completed
accepted → cancelled
```

Cuando un match es rechazado o cancelado, las prendas vuelven a estar disponibles.

Cuando un match es aceptado o completado, las prendas permanecen bloqueadas.

---

## 5. Heritage Timeline

Cada acción importante genera un evento histórico.

Eventos principales:

```txt
garment_registered
match_created
match_accepted
match_rejected
match_cancelled
exchange_completed
```

Estos eventos permiten construir el historial de cada prenda.

---

# My Style Score

El **My Style Score** es una métrica central del dashboard. Su objetivo es representar la identidad de estilo del usuario mediante una puntuación de 0 a 100.

El score se calcula con cuatro dimensiones:

```txt
Style Score =
  Wardrobe Score
+ Style Identity Score
+ Heritage Score
+ Exchange Score
```

---

## 1. Wardrobe Score

Mide la cantidad de prendas registradas.

```txt
wardrobeScore = min(totalGarments * 7, 35)
```

Máximo:

```txt
35 puntos
```

Ejemplo:

```txt
5 prendas registradas = 35 puntos
```

---

## 2. Style Identity Score

Mide qué tan clara es la identidad de estilo del usuario.

Primero se calcula el ratio de dominancia:

```txt
dominanceRatio = dominantStyleCount / totalGarments
```

Luego se asigna el score:

```txt
Si dominanceRatio >= 0.60 → 25 puntos
Si dominanceRatio >= 0.35 → 18 puntos
Si dominanceRatio < 0.35  → 10 puntos
```

Máximo:

```txt
25 puntos
```

---

## 3. Heritage Score

Mide la cantidad de eventos históricos generados.

```txt
heritageScore = min(heritageEventsCount * 4, 20)
```

Máximo:

```txt
20 puntos
```

---

## 4. Exchange Score

Mide actividad de intercambio.

```txt
exchangeScore = min(activeMatches * 5 + completedExchanges * 10, 20)
```

Máximo:

```txt
20 puntos
```

---

## Score final

```txt
finalScore = min(
  wardrobeScore +
  styleIdentityScore +
  heritageScore +
  exchangeScore,
  100
)
```

---

# Buenas prácticas aplicadas en el Core MVC

En esta fase se aplicaron buenas prácticas de arquitectura sobre el Core MVC, incorporando principios SOLID y patrones de diseño.

---

# Principios SOLID aplicados

## 1. Single Responsibility Principle - SRP

El principio de responsabilidad única indica que cada módulo debe tener una sola razón para cambiar.

Antes del refactor, el archivo:

```txt
core-dashboard.service.ts
```

tenía demasiadas responsabilidades:

* Construía el resumen del dashboard
* Calculaba el estilo dominante
* Calculaba el Style Score
* Calculaba labels
* Calculaba descripciones
* Calculaba confianza del score

Después del refactor, se separaron responsabilidades:

```txt
core-dashboard.service.ts
```

Responsabilidad actual:

* Construir el resumen general del dashboard

```txt
style-score.service.ts
```

Responsabilidad actual:

* Construir el resultado final del My Style Score

```txt
style-score-strategies.ts
```

Responsabilidad actual:

* Definir las reglas individuales del cálculo del score

Beneficio:

* Código más limpio
* Mejor organización
* Menos acoplamiento
* Más fácil de mantener
* Más fácil de explicar y probar

---

## 2. Open/Closed Principle - OCP

El principio Open/Closed indica que el código debe estar abierto a extensión, pero cerrado a modificación.

Antes del refactor, si se quería agregar una nueva dimensión al Style Score, era necesario modificar directamente el algoritmo principal.

Después del refactor, el cálculo utiliza estrategias independientes.

Ejemplo:

```ts
export const STYLE_SCORE_STRATEGIES: StyleScoreStrategy[] = [
  wardrobeScoreStrategy,
  styleIdentityScoreStrategy,
  heritageScoreStrategy,
  exchangeScoreStrategy,
];
```

Si en el futuro se desea agregar una nueva dimensión, como reputación del usuario o compatibilidad de recomendaciones, solo se crea una nueva estrategia y se agrega al arreglo.

Beneficio:

* El algoritmo principal no se modifica
* El sistema se puede extender fácilmente
* Se reduce el riesgo de romper lógica existente
* El código queda preparado para futuras mejoras

---

# Patrones de diseño aplicados

## 1. Strategy Pattern

El patrón Strategy permite definir una familia de algoritmos, encapsularlos y hacerlos intercambiables.

En Swapper se aplicó este patrón en el cálculo del **My Style Score**.

Cada dimensión del score se implementó como una estrategia independiente:

```txt
Wardrobe Score Strategy
Style Identity Score Strategy
Heritage Score Strategy
Exchange Score Strategy
```

Cada estrategia tiene la siguiente estructura:

```ts
export type StyleScoreStrategy = {
  key: StyleScoreBreakdownKey;
  name: string;
  maxScore: number;
  calculate: (context: StyleScoreContext) => number;
};
```

Esto permite que cada parte del score tenga su propia fórmula y responsabilidad.

Beneficio:

* Cada regla es independiente
* El algoritmo es más fácil de entender
* Se pueden agregar nuevas reglas sin modificar todo el servicio
* Se cumple el principio Open/Closed

---

## 2. Repository Pattern

El patrón Repository permite aislar la lógica de acceso a datos.

En Swapper, la carpeta:

```txt
models/
```

cumple el rol de repositorio.

Los controladores no consultan directamente Supabase. En su lugar, llaman funciones de los modelos.

Ejemplo en el Core Dashboard:

```txt
getCoreDashboardGarments()
getCoreDashboardMatches()
getCoreDashboardHeritageEvents()
```

Estas funciones encapsulan las consultas a Supabase.

Beneficio:

* Los controladores quedan más limpios
* El acceso a datos queda centralizado
* Es más fácil cambiar la fuente de datos en el futuro
* Se mejora la separación de responsabilidades

---

# Archivos modificados en esta mejora

## Nuevo archivo: style-score-strategies.ts

Ubicación:

```txt
services/style-score-strategies.ts
```

Responsabilidad:

* Definir las estrategias individuales del Style Score
* Contener las fórmulas separadas
* Permitir extender el score en el futuro

---

## Nuevo archivo: style-score.service.ts

Ubicación:

```txt
services/style-score.service.ts
```

Responsabilidad:

* Ejecutar las estrategias
* Construir el breakdown del score
* Calcular el score final
* Calcular la confianza
* Calcular el label
* Calcular la descripción del score

---

## Archivo refactorizado: core-dashboard.service.ts

Ubicación:

```txt
services/core-dashboard.service.ts
```

Responsabilidad después del refactor:

* Calcular métricas generales del dashboard
* Detectar estilo dominante
* Llamar a `buildStyleScore`
* Retornar el resumen del dashboard

---

# Resultado del refactor

El comportamiento visual del proyecto no cambia.

El usuario sigue viendo:

* My Style Score
* Sugerencias de estilo
* Armario
* Estilo dominante
* Matches
* Heritage reciente

La mejora está en la arquitectura interna.

Antes:

```txt
core-dashboard.service.ts contenía demasiada lógica.
```

Después:

```txt
La lógica está separada por responsabilidades.
```

Esto hace que el proyecto sea:

* Más mantenible
* Más escalable
* Más fácil de probar
* Más fácil de explicar
* Más alineado con buenas prácticas de desarrollo

---

# Instalación local

## 1. Clonar el repositorio

```bash
git clone https://github.com/Jeanpro2004/Swapper_Core.git
```

## 2. Entrar al proyecto

```bash
cd Swapper_Core
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Configurar variables de entorno

Crear un archivo:

```txt
.env.local
```

Agregar:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Ejecutar en local

```bash
npm run dev
```

Abrir:

```txt
http://localhost:3000
```

---

# Scripts disponibles

```bash
npm run dev
```

Ejecuta el proyecto en modo desarrollo.

```bash
npm run build
```

Genera el build de producción.

```bash
npm run start
```

Ejecuta el proyecto en modo producción después del build.

---

# Deploy

El proyecto está preparado para deploy en **Vercel**.

Configuración recomendada:

```txt
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: default
```

Variables de entorno requeridas en Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# Evidencia del taller

Para la evidencia de la consigna se entrega:

1. Link del código en GitHub
2. README explicado con arquitectura, SOLID y patrones
3. Video explicando mejoras aplicadas en el Core
4. Link del proyecto deployado

---

# Guía breve para explicar en video

En el video se debe mostrar:

## 1. Dashboard funcionando

Mostrar que la aplicación sigue funcionando después del refactor.

## 2. Core Dashboard Service

Explicar que este servicio ahora se enfoca en construir el resumen del dashboard.

## 3. Style Score Service

Explicar que este servicio tiene una única responsabilidad: construir el My Style Score.

## 4. Style Score Strategies

Explicar que cada parte del score vive en una estrategia independiente.

## 5. SOLID

Mencionar:

```txt
SRP: separé responsabilidades.
OCP: puedo agregar nuevas estrategias sin modificar el algoritmo principal.
```

## 6. Patrones de diseño

Mencionar:

```txt
Strategy Pattern: aplicado al cálculo del Style Score.
Repository Pattern: aplicado en la capa models para aislar Supabase.
```

---

# Autor

Proyecto académico desarrollado por:

```txt
Jean Paul Rodríguez
```
