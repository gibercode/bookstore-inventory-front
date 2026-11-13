# Diseño: Librook

Dashboard minimalista y premium, replicado de una referencia SaaS: sidebar blanca con íconos, tarjetas de métricas, filtros en chip, tabla dentro de una tarjeta suave, estados en píldora y paginación numerada. Solo modo claro, solo escritorio.

Los valores viven en `src/styles/tokens.css`; este documento explica las reglas.

## Color

| Rol | Token | Valor |
|---|---|---|
| Fondo de la app | `--bg` | `#f8fafc` |
| Superficie (sidebar, tarjetas) | `--surface` | `#ffffff` |
| Texto | `--ink` / `--ink-soft` / `--ink-muted` | `#111827` / `#475569` / `#6b7280` |
| Línea | `--line` / `--line-strong` | `#eef0f4` / `#e2e8f0` |
| Acción (esmeralda) | `--action` | `#059669` |
| Disponible | `--stock-ok` | `#15803d` sobre `#dcfce7` |
| Bajo | `--stock-low` | `#1d4ed8` sobre `#dbeafe` |
| Agotado | `--stock-out` | `#b91c1c` sobre `#fee2e2` |

Reglas:
- Fondo frío y casi blanco. Nada de tonos cálidos, amarillos ni ocres.
- El esmeralda es el único color de acción: ítem activo, botón primario, página actual, enlaces.
- El estado de stock siempre lleva texto además de color.
- El esmeralda de la referencia (`#10b981`) no alcanza AA con texto blanco; se usa `#059669` (≈3.8:1, aceptable solo en texto de 14px semibold). Verificar antes de cerrar.

## Tipografía

- **Inter** (variable, self-hosted con `@fontsource`) para todo.
- Cuerpo 14px. Título de pantalla 26px / 600. Cifras de tarjeta 30px / 700, `tabular-nums`.
- Encabezados de tabla 13px / 600. Etiquetas de sección 11px en mayúsculas.

## Forma y estructura

- Radios: 10 a 12px en controles, 18 a 20px en tarjetas, píldora en estados.
- Sombras suaves de una capa, solo en tarjetas, chips y botones. Sin degradados.
- Sidebar de 240px, contenido hasta 1440px, espaciado base de 4px.
- Foco visible de 2px. Movimiento: solo color, 120ms; respetar `prefers-reduced-motion`.

## Componentes

- **Sidebar:** logo Librook, sección «Principal», ítem activo con fondo `--action-soft`. Solo hay «Libros» porque es la única pantalla.
- **StatCard:** etiqueta, ícono en círculo tintado, cifra grande, píldora y texto de apoyo. Solo datos reales de la API.
- **Filtros:** solo los que tienen endpoint: categoría y stock bajo. Cada uno es un endpoint distinto, así que son excluyentes (uno a la vez).
- **Tarjeta de tabla:** título a la izquierda y «Ordenar por» a la derecha (solo sin filtro, porque `/search/` y `/low-stock/` no aceptan `ordering`).
- **Tabla:** cabecera tintada y redondeada, filas de 60px, categoría con punto de color.
- **StockBadge:** píldora con cantidad y estado.
- **Paginación:** botones numerados alineados a la derecha, página actual en esmeralda.

## Evitar

Tonos ocre, amarillos o cálidos, gradientes, métricas o variaciones inventadas, ilustraciones, hero, botones sin acción real.
