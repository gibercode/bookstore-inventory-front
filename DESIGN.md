# Diseño: «Librería de lomo»

Ficha de catálogo de biblioteca llevada a una pantalla de trabajo: papel cálido, tinta oscura, filas densas separadas por líneas finas. Solo modo claro, solo escritorio.

Los valores viven en `src/styles/tokens.css`; este documento explica las reglas.

## Referencias

- **Are.na:** líneas de 1px, radio 0, sin sombras, densidad alta, mono para etiquetas y conteos, búsqueda como protagonista.
- **Readwise:** papel crema en vez de blanco, tinta cálida en vez de negro, serif para títulos sobre sans para el cuerpo.
- **Fitzcarraldo / NYRB:** tipografía y color hacen el trabajo; nada decorativo.

## Color

| Rol | Token | Valor |
|---|---|---|
| Papel (fondo) | `--paper` | `#f4efe6` |
| Superficie | `--surface` | `#fbf8f2` |
| Tinta | `--ink` | `#1d1a16` |
| Texto secundario | `--ink-muted` | `#5f574c` |
| Línea | `--line` | `rgba(40,30,20,.16)` |
| Acción (verde botella) | `--action` | `#1f4d3a` |
| Stock disponible / bajo / agotado | `--stock-ok` / `--stock-low` / `--stock-out` | `#2f6b4f` / `#8a5a00` / `#9c3a22` |

Reglas:
- El verde botella es el único color de acción: botones primarios, enlaces, foco. No se usa para decorar.
- El estado de stock siempre lleva texto además de color.
- Contrastes estimados en AA; verificar con una herramienta antes de cerrar.

## Tipografía

- **Instrument Serif:** títulos de pantalla (`--text-xl` a `--text-2xl`). Nunca en tablas ni en controles.
- **Geist:** UI y cuerpo, 14px por defecto, pesos 400 y 500.
- **Geist Mono:** ISBN, SKU, cantidades, precios, fechas. Con `font-variant-numeric: tabular-nums`.

Las fuentes se cargan self-hosted (pendiente: `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`).

## Forma y estructura

- Radio 0 en todo. Sin sombras, sin degradados.
- La jerarquía la dan las líneas de 1px (`--hairline`) y el tinte de fondo en hover.
- Foco: contorno de 2px en `--focus`.
- Movimiento: solo color, 120ms. Respetar `prefers-reduced-motion`.
- Layout: sidebar fija de 220px, topbar de 48px, contenido hasta 1440px.

## Componentes clave (por diseñar)

- **Tabla de libros:** vista principal, filas densas, columnas numéricas en mono alineadas a la derecha.
- **Vista de lomos:** alternativa a la tabla; el color del lomo sale de la portada o de la categoría.
- **Buscador:** siempre visible en la topbar y protagonista en Libros.
- **StockBadge:** texto en mono con fondo tintado, sin borde redondeado.

## Evitar

Morado o azul con degradados, tarjetas con sombra y esquinas redondas, íconos de libro decorativos, ilustraciones, hero, Inter por defecto.
