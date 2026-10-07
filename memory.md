# Memoria del proyecto — Karate Scoreboard AKT

## Qué es y para qué sirve

Aplicación de escritorio para gestionar competencias de karate de la Asociación de Karate y Artes Marciales de Tamaulipas: registrar participantes, clasificarlos, generar gráficas de enfrentamientos y operar marcadores de kata y kumite. La interfaz principal funciona localmente; muestra el marcador en otra ventana y permite exportar/importar respaldos JSON. La implementación actual es `karate-scoreboard-electron` 1.3.1.

## Stack y arquitectura real

- **Escritorio:** Electron 41, iniciado en `main.js` mediante `BrowserWindow.loadFile('index.html')`; empaquetado con Electron Forge 7 y configuración de makers en `forge.config.js`.
- **Interfaz principal:** HTML + JavaScript sin framework de compilación para la aplicación; Vue 3 Composition API (`ref`, `reactive`, `computed`, `watch`, `onMounted`) importado como módulo desde `node_modules` dentro de `index.html`. Plantillas Vue en ese mismo archivo con `v-if`, `v-for` y `v-model`. No hay carpetas `src/` ni separación en componentes Vue.
- **Estilos:** Tailwind CSS 3; `input.css` contiene directivas y estilos propios; `css/output.css` es el resultado minificado, versionado en Git. `tailwind.config.js` escanea `index.html` y `main.js`. Fontsource (Roboto y Oswald) y Font Awesome se cargan desde `node_modules` en la página principal.
- **Datos e integraciones:** el flujo principal persiste eventos, competidores, gráficas y atajos en `localStorage`; usa `BroadcastChannel('karate_manager_sync')` para sincronizar operador y marcador en distintas ventanas. EmailJS y QRCodeJS se cargan mediante CDN. `login.html` es una página distinta, con Vue/Tailwind por CDN y Firebase Authentication/Firestore; no es la pantalla de inicio de Electron. Hay dependencias Firebase en `package.json`, pero el flujo activo de `index.html` es local.
- **Hosting:** `.firebaserc` apunta al proyecto `marcador-karate-akt`; `firebase.json` publica la raíz `./` e ignora `firebase.json`, archivos ocultos y `node_modules`. Esto es configuración existente, no prueba de un despliegue automático.

## Estructura desde la raíz

| Ruta | Función |
| --- | --- |
| `package.json`, `package-lock.json` | Dependencias npm y comandos de desarrollo/empaquetado. |
| `main.js`, `forge.config.js` | Proceso principal de Electron y makers del paquete. |
| `index.html` | Aplicación activa: vistas, datos, reglas de competencia y control del marcador en un único archivo. |
| `login.html` | Variante separada de acceso/nube con Firebase y CDN. |
| `input.css`, `tailwind.config.js`, `css/output.css` | Fuente, configuración y salida generada de estilos. |
| `experimentals/`, `codigoQr.html`, `404.html` | Versiones/páginas alternativas, QR y página de error; no son el punto de entrada de Electron. |
| `.firebaserc`, `firebase.json` | Configuración de proyecto y hosting Firebase. |
| `28-logo.png`, `28-logo.ico` | Identidad visual e icono del paquete. |
| `AGENTS.md`, `README.md`, `LICENSE.md` | Instrucciones para agentes, puesta en marcha y términos de esta versión. |
| `node_modules/`, `out/`, `.firebase/` | Dependencias, artefactos de empaquetado y caché local; ignorados por Git. |

## Reglas funcionales implementadas

- `RULES` y `computeCategory` en `index.html` clasifican por edad (U12, U14, cadete, junior, U21 y sénior), género, modalidad y tipo; kumite individual añade peso según tablas **ESTATAL** o **NACIONAL**.
- `BracketSystem` agrupa por categoría, intercala participantes de distintos municipios, arma rondas con tamaños 4/8/16/32 y propaga ganadores. `generateBrackets` guarda el resultado en `localStorage`.
- Kumite usa reloj en milisegundos y puntuaciones yuko=1, waza-ari=2, ippon=3. `checkAutoWin` detiene el combate ante diferencia de 8 puntos o decide por puntos/senshu al finalizar el tiempo. `finishKumiteMatch` solicita hantei manual si persiste el empate. Las duraciones configuradas en `timeRules` incluyen 3:00, 2:00 y 1:30 según categoría.
- Kata calcula el total con 5 o 7 jueces: descarta el valor mayor y el menor (5), o dos de cada extremo (7), y suma tres notas. El flujo de enfrentamiento evalúa a ambos competidores y permite decidir manualmente un empate. Existe temporizador de 35 segundos.
- `?view=scoreboard&mode=...`, `?view=judge&judgeId=...` y `?eventId=...` seleccionan vistas por URL. El marcador usa `BroadcastChannel`; el modo juez tiene funciones `initJudgeListener`, `sendJudgeScore` y `setupKataListener` vacías en la página activa: las pantallas/QR no equivalen a una integración inalámbrica terminada.
- El respaldo JSON manual y el automático (cada 10 minutos, tras elegir carpeta compatible con `showDirectoryPicker`) incluyen competidores y gráficas; **no** incluyen eventos. La importación restaura los mismos datos.

## Convenciones y patrones existentes

- Código actual de una sola página: estado reactivo en `setup()`, datos derivados en `computed`, efectos/sincronización en `watch` y acciones como funciones locales retornadas a la plantilla. `BracketSystem` es un objeto auxiliar con métodos de distribución, creación y propagación; no hay backend ni capa de servicios en la aplicación principal.
- JavaScript CommonJS en configuración/Electron y módulos ES dentro de los HTML; nombres de variables y funciones principalmente en `camelCase`, objetos utilitarios como `BracketSystem` en `PascalCase`, constantes de reglas en mayúsculas. Identificadores y textos mezclan español e inglés, tal como está el código; no hay formatter ni reglas de lint configuradas.
- Al modificar clases Tailwind o `input.css`, volver a ejecutar `npm run build:css` y considerar `css/output.css` parte del cambio. `login.html` usa Tailwind por CDN y **no** está incluido en el escaneo de `tailwind.config.js`.
- `LICENSE.md` establece los términos de esta versión. El campo `"license": "ISC"` de `package.json` no coincide con ese documento; la discrepancia sigue presente y no debe interpretarse como una convención resuelta.

## Flujo de trabajo y verificación

1. `npm ci` para instalar las dependencias fijadas en el lockfile.
2. `npm start` ejecuta primero `npm run build:css` y luego abre Electron. Para revisar solo la interfaz en navegador, ejecutar `npm run build:css` y servir la raíz por HTTP local (`python -m http.server 4173 --bind 127.0.0.1`); `index.html` requiere las rutas de `node_modules`.
3. Verificación enfocada disponible: `npm run build:css` y revisión manual del flujo afectado (registro, gráficas, operador, marcador y persistencia/respaldos según corresponda). `npm run package` también compila CSS y crea el paquete mediante Forge.
4. En el `package.json` versionado en `main`, `npm run make` compila CSS y ejecuta Electron Forge. Si una copia local presenta el error tipográfico `b|ild:css`, ese script falla; verifica el manifiesto antes de empaquetar. `npm run dist` llama a `electron-builder`, que no figura entre las dependencias.

`npm test` es un placeholder que termina con error. No se encontraron suites de pruebas, configuración de lint/typecheck, workflows de CI ni plantillas de PR en este repositorio. Por tanto, no hay pipeline ni orden de checks exigido por configuración.

## Estilo de commits y PR: referencia Invita Fácil

**Propuesta solicitada para este proyecto; no es todavía una práctica demostrada por su historial**, que incluye mensajes como `Initial commit`, `baseline: ...` e `Integrate stable Electron scoreboard v1.3.1`. Referencia observada: [commits](https://github.com/ingdariovargasjr/invitaciones-boda/commits/main) y [PRs](https://github.com/ingdariovargasjr/invitaciones-boda/pulls?q=is%3Apr).

- **Commits:** prefijo de tipo en minúsculas, dos puntos y resumen breve de la acción: `feat: add ...`, `fix: ...`, `docs: ...`, `chore: ...`; también se observó `security: ...`. Los asuntos suelen ser concisos y frecuentemente están en inglés; no hay evidencia de un validador automático. Ejemplo adaptable: `feat: add kumite category filters`.
- **Ramas/PRs:** trabajo en rama aparte con PR hacia `main`; se observan nombres como `enhancement/...`, `fix/...` y `bug-01-...`, sin un único patrón obligatorio. Títulos de PR como `feat: launch Invita Fácil event platform` y `fix: return JSON for API failures`.
- **Descripción de PR:** texto en español con `Resumen` o explicación del problema, lista de `Cambios`/`Incluye`, `Validación` con los comandos y comprobaciones **realmente ejecutados**, y `Despliegue`/`Nota` cuando corresponde. Aquí no se deben copiar checks ajenos (`typecheck` o `build` de Invita Fácil): indicar, por ejemplo, `npm run build:css` y las verificaciones manuales efectivas. El historial de Invita Fácil muestra tanto merges como squash; no se deduce un método obligatorio.

## Prohibiciones del proyecto

Pendiente: las definirá el propietario por separado. Esta sección no establece prohibiciones nuevas.
