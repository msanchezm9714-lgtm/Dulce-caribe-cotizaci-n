# Dulce Caribe — Propuesta de paquete gráfico

Landing estática (HTML + CSS + JS, sin dependencias ni build) para presentar la propuesta a Dulce Caribe, Playa del Carmen.

## Estructura

```
web/                    ← raíz del repo y de Vercel
├── index.html          ← contenido de la propuesta
├── favicon.svg
├── og-image.png        ← imagen al compartir el link (1200×630)
├── vercel.json         ← URLs limpias + cabeceras básicas
└── assets/
    ├── css/styles.css  ← paleta (:root), tipografía y secciones
    └── js/
        ├── mascots.js  ← personajes ilustrados (SVG generado)
        └── main.js     ← animaciones de scroll + acomodo anti-choques
```

## Editar rápido

| Qué | Dónde |
|---|---|
| Textos, precio, plazos | `index.html` |
| WhatsApp del botón "Quiero el paquete" | `index.html` → busca `wa.me/52…` |
| Colores | `assets/css/styles.css` → bloque `:root` |
| Personajes de cada sección | `index.html` → `<div class="fl at-tr" data-m="berry">` |

**Personajes:** `data-m` = `sun cloud heart star berry cherry lemon orange pineapple daisy blossom bolt cupcake cone rainbow` · `data-c` = color principal (hex) · `at-tr / at-tl / at-br / at-bl` = esquina · `--w` tamaño en PC, `--mw` en celular.
Si un personaje llega a tocar texto en algún tamaño de pantalla, `main.js` lo mueve al hueco libre más cercano, lo achica o lo oculta. Nunca se monta sobre letras.

## Subir a GitHub

1. github.com → **New repository** → nombre `dulce-caribe` → privado o público → *Create*.
2. *uploading an existing file* → arrastra **el contenido** de la carpeta `web/` (no la carpeta) → *Commit*.

O desde la terminal, dentro de `web/`:

```bash
git init && git add . && git commit -m "Propuesta Dulce Caribe"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/dulce-caribe.git
git push -u origin main
```

## Publicar en Vercel

1. vercel.com → **Add New → Project** → importa el repo `dulce-caribe`.
2. Framework Preset: **Other** · Build Command: *(vacío)* · Output Directory: *(vacío / `.`)*.
3. **Deploy**. Cada `push` a `main` vuelve a publicar solo.

## Después de publicar: activar la vista previa al compartir

`index.html` tiene `https://TU-DOMINIO.vercel.app` en 5 lugares (canonical, `og:url`, `og:image`, `twitter:image`). Búscalo y reemplázalo por tu URL real de Vercel (ej. `https://dulce-caribe.vercel.app`), haz commit y listo.

Para probar: pega el link en WhatsApp o en https://www.opengraph.xyz. Si WhatsApp muestra la imagen vieja, es caché: agrega `?v=2` al final del link.

La imagen se regenera desde `../og/og.html` (fuera de `web/`, no se publica): ábrela en Chrome a 1200×630 y captura.
