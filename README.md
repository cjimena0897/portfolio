# Claudia Jiménez · Portfolio

Portafolio personal (HTML + CSS + JS, sin dependencias), publicado con GitHub Pages.

## Estructura
- `index.html` — inicio (Hero, Projects, resumen de About, Contact)
- `about.html` — página Sobre mí (intro, Experience, Education, Skills, Contact)
- `projects.html` — todos los proyectos
- `projects/*.html` — una página por proyecto (caso de estudio), con navegación anterior/siguiente
- `styles.css` — estilos (todos los colores son variables en `:root`, con su versión oscura justo debajo)
- `script.js` — menú móvil, animaciones al hacer scroll, tema claro/oscuro e idioma
- `assets/` — imágenes (foto y mockups de proyectos)

## Cómo agregar imágenes
1. Sube la imagen a `assets/` con el nombre del proyecto (por ejemplo `assets/crypto-marketplace.png`).
2. Reemplaza el `<div class="placeholder">…</div>` por la etiqueta `<img>` que aparece comentada justo encima (en `index.html`, `projects.html` y la página del proyecto).

## Tema claro / oscuro
- Por defecto sigue la preferencia del sistema; el botón sol/luna del menú guarda la elección en `localStorage` (`theme`).
- Los colores viven solo como variables en `styles.css`. Si agregas un color nuevo, defínelo en `:root` **y** en los dos bloques oscuros
  (`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` y `:root[data-theme="dark"]`), que deben ser idénticos.

## Idiomas (EN / ES)
Cada texto está escrito en los dos idiomas, uno al lado del otro; el CSS oculta el que no corresponde según `<html data-lang>`.
El idioma se elige así: lo guardado en `localStorage` (`lang`), si no el idioma del navegador (`es…` → español), si no inglés.

Para agregar texto bilingüe, pon los dos `span` **dentro** del elemento (no dupliques el elemento):

```html
<p class="card__desc"><span data-l="en">Design of…</span><span data-l="es">Diseño de…</span></p>
<h2 class="section__title"><span><span data-l="en">The challenge</span><span data-l="es">El reto</span></span></h2>
```

- Títulos de sección: envuelve el par en un `<span>` extra (como arriba) para que la línea decorativa siga funcionando.
- Atributos (`aria-label`, `alt`, `placeholder`, `title`): agrega `data-en-<atributo>` y `data-es-<atributo>`, p. ej.
  `<img src="…" alt="Retrato" data-en-alt="Portrait" data-es-alt="Retrato">`.
- Título de la pestaña: `<title data-en="…" data-es="…">`.
- Páginas nuevas: copia el `<head>` (incluye el pequeño script que aplica tema e idioma antes de pintar) y el `<header>` de una página existente.

## Ver en local
Abre `index.html` en el navegador.
