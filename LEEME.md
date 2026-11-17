# Labs Libres UTS (PWA) — con CI/CD

PWA que muestra qué laboratorio de TIC está libre en cada bloque.
Cada push a `main` se prueba y se publica solo en Netlify con GitHub Actions.

## Estructura
- `public/` – la app (lo único que se publica)
  - `index.html` – interfaz
  - `datos.js` – horarios de los labs (`LABS`) y lógica (`estado()`)
  - `sw.js` – service worker (funciona sin internet)
  - `manifest.json`, iconos
- `tests/datos.test.js` – pruebas automáticas
- `.github/workflows/ci-cd.yml` – pipeline CI/CD

## Comandos
```
npm test      # corre las pruebas (no ocupa instalar nada, Node 20+)
npm start     # levanta la app en http://localhost:3000
```

## Pipeline
1. Push o Pull Request → GitHub Actions corre `npm test`.
2. Si las pruebas pasan y es push a `main` → publica `public/` en Netlify.
3. Si una prueba falla → no se publica nada y el PR queda bloqueado.

## Secrets necesarios (GitHub → Settings → Secrets and variables → Actions)
- `NETLIFY_AUTH_TOKEN` – Netlify → User settings → Applications → Personal access tokens
- `NETLIFY_SITE_ID` – Netlify → tu sitio → Site configuration → General → Site ID

## Cambiar horarios (nuevo cuatrimestre)
En `public/datos.js` edita `const LABS=`. Formato: `"bloque|materia|grupo|profe"`, ej. `"3|FdR|DSM1A|KTolano"`.
Si te equivocas (bloque fuera de 1–14, materia que no existe, bloque repetido), el pipeline lo detecta y no publica.

## Instalar en el cel
- Android (Chrome): menú ⋮ → "Instalar app".
- iPhone (Safari): Compartir → "Agregar a inicio".
