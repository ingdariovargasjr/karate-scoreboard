# Karate Scoreboard AKT

Aplicación de escritorio para organizar competencias de **kata y kumite** de la Asociación de Karate y Artes Marciales de Tamaulipas. Permite registrar competidores, asignarles categorías, generar gráficas de enfrentamientos y operar el marcador durante los combates. La versión actual del proyecto es **1.3.1**.

> **Estado:** la aplicación principal funciona en modo local. Algunas pantallas e integraciones de nube/jueces están presentes, pero no constituyen todavía un flujo inalámbrico completo. Consulta [Limitaciones y problemas conocidos](#limitaciones-y-problemas-conocidos).

## Funcionalidades

- Registro individual o por equipos, con categorías por edad, género y modalidad. Kumite individual contempla tablas de peso estatal y nacional.
- Generación de gráficas por categoría, visualización de rondas y operación de encuentros de kata y kumite.
- Marcador de kumite con reloj, puntuaciones de 1/2/3 puntos, penalizaciones, senshu y decisión por ventaja o al finalizar el tiempo.
- Evaluación de kata con 5 o 7 jueces, descarte de notas extremas, temporizador y resolución manual de empates.
- Ventana adicional de marcador sincronizada con el operador mediante `BroadcastChannel`; atajos de teclado configurables.
- Datos locales con exportación e importación de respaldo JSON. La copia automática requiere seleccionar una carpeta compatible con la API `showDirectoryPicker`.
- Enlaces de pre-registro por evento y códigos QR para las vistas de jueces; esta última integración permanece incompleta.

## Tecnologías y dependencias

| Área | Implementación |
| --- | --- |
| Aplicación de escritorio | Electron 41 y Electron Forge 7 |
| Interfaz | HTML, JavaScript y Vue 3 (Composition API) |
| Estilos e iconografía | Tailwind CSS 3, Fontsource (Roboto/Oswald) y Font Awesome |
| Persistencia del flujo principal | `localStorage` del navegador integrado; `BroadcastChannel` para sincronizar ventanas |
| Servicios opcionales/separados | EmailJS y QRCodeJS por CDN; `login.html` utiliza Firebase Auth/Firestore y recursos por CDN |
| Herramientas de desarrollo | Node.js, npm y `package-lock.json` |

La aplicación abierta por Electron es `index.html` desde `main.js`. `login.html` es otra página: **no** se inicia automáticamente ni convierte al flujo principal en una aplicación alojada en Firebase. Para instalar desde el código se necesita acceso a este repositorio y conexión a npm; algunas integraciones cargadas desde CDN también requieren conexión a Internet.

## Instalación desde el código fuente

1. Instala Git, Node.js y npm. El proyecto no declara una versión mínima de Node; utiliza una versión compatible con las dependencias fijadas en `package-lock.json`.
2. Clona el repositorio (se requieren permisos si es privado) e instala las dependencias:

   ```sh
   git clone https://github.com/ingdariovargasjr/karate-scoreboard.git
   cd karate-scoreboard
   npm ci
   ```

3. Inicia la aplicación:

   ```sh
   npm start
   ```

`npm start` genera `css/output.css` y abre la ventana Electron. El desarrollo local se ha comprobado en Windows; `forge.config.js` también declara makers para otros sistemas, pero aquí no se documenta una validación de sus paquetes.

### Revisión de la interfaz en navegador

Si solo quieres inspeccionar la interfaz sin abrir Electron, después de `npm ci`:

```sh
npm run build:css
python -m http.server 4173 --bind 127.0.0.1
```

Abre <http://127.0.0.1:4173/index.html>. Es una vista local de la aplicación; sus datos de `localStorage` son distintos a los del perfil de Electron. No abras `index.html` directamente con `file://`: sus módulos y recursos locales necesitan servirse correctamente.

## Comandos de desarrollo y empaquetado

| Comando | Resultado |
| --- | --- |
| `npm run build:css` | Genera `css/output.css` desde `input.css` y las clases detectadas en `index.html`/`main.js`. |
| `npm start` | Compila CSS e inicia Electron Forge. |
| `npm run package` | Compila CSS y crea el paquete de la aplicación sin generar necesariamente un instalador. |
| `npm run make` | En el `package.json` versionado en `main`, compila CSS y ejecuta los makers de Electron Forge; los artefactos se generan en `out/`. |

`css/output.css` está versionado: incluye su regeneración en cambios de estilos o clases Tailwind. `npm run dist` llama a `electron-builder`, paquete que **no figura** entre las dependencias declaradas; no es la ruta documentada para generar distribuciones. No se ofrece aquí un instalador de descarga verificado: el procedimiento anterior instala y ejecuta el **código fuente**.

## Cómo se usan los datos y el marcador

El flujo activo guarda competidores, gráficas y preferencias de teclado en el almacenamiento local del perfil donde se ejecuta; también lee eventos locales, aunque su creación tiene un fallo conocido. La vista principal arranca en registro; desde la navegación se accede a gráficas y a los operadores de kata/kumite. La ventana de TV/marcador usa una URL con `?view=scoreboard` y recibe el estado del operador por `BroadcastChannel('karate_manager_sync')`.

El respaldo JSON manual y la copia automática incluyen **competidores y gráficas, pero no eventos**. Exporta tus datos antes de borrar el almacenamiento local o cambiar de perfil/equipo. La importación restaura competidores y gráficas. El autoguardado, cuando el selector de carpetas está disponible y autorizado, se realiza cada 10 minutos.

## Limitaciones y problemas conocidos

| Área | Estado actual / acción sugerida |
| --- | --- |
| Jueces inalámbricos | Existen pantalla y QR (`?view=judge&judgeId=...`), pero `initJudgeListener`, `sendJudgeScore` y `setupKataListener` están vacías en `index.html`. No depender de la recepción remota de notas hasta implementar y verificar ese flujo. |
| Creación de eventos | `createEvent` en `index.html` construye `newEvent`, pero después referencia un `id` no definido y no incorpora el evento a la lista. La gestión de eventos requiere corrección antes de considerarla funcional. |
| Reloj al abrir kumite desde gráficas | `openMatchOperator` asigna `rule.seconds` al temporizador que el resto del código mide en milisegundos. Verifica y reinicia el reloj desde el operador antes de iniciar un combate; queda pendiente corregir esa conversión. |
| Respaldos | La exportación no guarda eventos; el autoguardado depende de `window.showDirectoryPicker`, que puede no estar disponible en todos los entornos. Utiliza la exportación manual de competidores/gráficas cuando corresponda. |
| Pruebas y CI | `npm test` es un placeholder que termina con error. No hay suite de pruebas, lint/typecheck ni workflows de CI configurados; los flujos modificados necesitan comprobación manual. |

### Solución de errores habituales

- **Faltan módulos de Vue, iconos o estilos:** ejecuta `npm ci` y después `npm run build:css`; verifica que `node_modules/` exista. No abras la página por `file://` para la revisión en navegador.
- **Electron no abre tras instalar:** comprueba la salida de `npm ci`. Si npm omitió los scripts de instalación de Electron, autorízalos según el mecanismo de aprobación de scripts de tu versión de npm y reinstala/reconstruye la dependencia antes de volver a ejecutar `npm start`.
- **Falló la generación de CSS:** ejecuta `npm run build:css` por separado para ver el error. Tailwind solo inspecciona `index.html` y `main.js`; `login.html` carga estilos por CDN.
- **`npm run make` menciona `b|ild:css`:** comprueba si tu `package.json` local tiene ese error tipográfico en vez de `build:css`. Como alternativa para probar el empaquetado sin editar ese archivo: ejecuta `npm run build:css` y luego `npx electron-forge make`.
- **El marcador no refleja cambios:** abre la ventana desde la aplicación principal; operador y marcador deben compartir el mismo origen/perfil para usar el canal de sincronización. Un navegador local y Electron no comparten automáticamente almacenamiento ni canal.

## Organización del repositorio

- `main.js`: ventana y ciclo de vida de Electron.
- `index.html`: interfaz y lógica del flujo local (registro, categorías, gráficas y marcador).
- `input.css`, `tailwind.config.js`, `css/output.css`: estilos fuente, configuración y salida generada.
- `forge.config.js`, `package.json`: empaquetado y scripts; `out/` contiene artefactos locales ignorados por Git.
- `login.html`: variante independiente con autenticación y datos Firebase.
- `experimentals/`: versiones alternativas/anteriores, no el punto de entrada de Electron.
- `memory.md`: documentación de arquitectura, reglas funcionales, convenciones y flujo de trabajo; `AGENTS.md`: instrucciones breves para agentes.

## Contribución y validación de cambios

Para cambios futuros se propone seguir el estilo usado en Invita Fácil: commits breves con prefijo (`feat:`, `fix:`, `docs:`, `chore:`), rama de trabajo y PR a `main`. En el PR describe **resumen, cambios y validación efectivamente realizada**; añade notas de despliegue cuando aplique. Aquí no hay checks automáticos que sustituyan la revisión manual. Consulta [memory.md](memory.md) para los patrones observados y el alcance real de los comandos.

## Licencia y despliegue

Las condiciones de esta versión están en [LICENSE.md](LICENSE.md). El valor `"license": "ISC"` de `package.json` no coincide con ese documento y está pendiente de reconciliarse; las versiones anteriores publicadas bajo MIT conservan sus propios términos.

`firebase.json` configura Hosting para publicar **la raíz del repositorio**. La existencia de esa configuración no implica despliegue automático; revisa el contenido servido y sus exclusiones antes de usarla para publicar la aplicación.
