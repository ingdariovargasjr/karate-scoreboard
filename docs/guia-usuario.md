# Guía rápida de usuario — Karate Scoreboard AKT

## 1. Primer inicio

1. Abre la aplicación desde el menú Inicio.
2. En **EVENTOS**, pulsa **CREAR EVENTO** y captura nombre, fechas y ubicación. El evento queda guardado localmente, sin conexión a la nube.
3. En **ADMIN**, puedes personalizar y guardar el **Nombre del torneo**; aparece en las vistas del operador y TV.
4. Registra competidores y revisa modalidad, categoría, municipio y, para kumite individual, peso.
5. En kata, selecciona **5 o 7 jueces** antes de generar las gráficas.
6. Pulsa **GENERAR GRÁFICAS**.

## 2. Operar kumite

1. Abre una categoría y selecciona un encuentro con dos atletas.
2. El panel azul AO queda a la izquierda y el rojo AKA a la derecha.
3. Usa las acciones `+1`, `+2`, `+3` y `-1` según corresponda.
4. Registra C1, C2, C3, HC, H o Senshu desde el panel del atleta.
5. Para atención médica: inicia y detén el combate, pulsa **Iniciar médico**, y al terminar pulsa **Terminar médico** o **Reset médico**. El combate se reanuda manualmente.
6. Pulsa **ABRIR SCOREBOARD TV** para abrir la vista externa.
7. Finaliza el encuentro cuando exista ganador.

### Shikkaku

Pulsa `S` bajo el atleta sancionado, selecciona manualmente otras inscripciones de la misma persona si corresponde y confirma. No selecciones homónimos automáticamente. El rival gana y las inscripciones vinculadas quedan excluidas de futuras gráficas.

## 3. Operar kata

1. Selecciona **KATA OP**.
2. En una actuación libre, elige 5 o 7 jueces antes de introducir notas.
3. Usa **INICIAR (35s)** para el aviso de inicio. En kata por equipo, al volver a pulsar ese botón se oculta 35s y comienza automáticamente **5:00** para la kata y el bunkai. El segundo clic en **DETENER (5:00)** oculta el reloj del scoreboard.
4. Captura las notas en la fila roja AKA y la azul AO.
5. En un encuentro de gráfica, captura AKA, pulsa **SIGUIENTE COMPETIDOR** y captura AO.
6. Si un juez da la misma calificación a AKA y AO, el resultado queda bloqueado: aparecerá un modal con el número del juez y debes corregir una de sus notas.
7. El ganador se decide por mayoría de votos, no por suma de notas.
8. Si hay empate global, corrige cualquier nota y vuelve a comparar. No se puede finalizar mientras continúe el empate.

## 4. Marcador TV

- Abre la TV desde el botón del operador; no abras `index.html` con `file://`.
- En la vista de **Registro/Admin**, usa **CARGAR LOGO** en el bloque **Logo de Kata TV** para elegir el logo del torneo; puedes cambiarlo o quitarlo después.
- TV kata presenta el tatami, categoría/división, competidor, municipio, kata y logo del torneo en una distribución de alto contraste.
- TV kumite distingue AKA rojo y AO azul, muestra sus puntos y penalizaciones, e identifica Senshu con un triángulo verde en el marcador correspondiente.
- Cada puntuación de kumite anuncia YUKO (ONE POINT), WAZA-ARI (TWO POINTS) o IPPON (THREE POINTS) a pantalla completa durante 1.5 segundos. El fondo corresponde a AKA rojo o AO azul e incluye una ilustración de la técnica.
- Las penalizaciones activas se resaltan en amarillo. El reloj detenido se ve blanco, en marcha amarillo y durante los últimos 15 segundos rojo.
- Al detener el reloj de kumite, se oculta del scoreboard. Al detener un reloj de kata, también desaparece; en kata por equipo, la secuencia de 35 segundos inicia el reloj de 5 minutos.
- Las vistas TV se sincronizan con el operador; mantén ambas ventanas abiertas en la aplicación durante el encuentro.
- TV kata no muestra notas individuales ni votos por juez.
- TV kata muestra votos totales al finalizar una gráfica o completar una actuación libre.
- Mientras un reloj de kata está visible, el reloj tiene prioridad sobre los votos.

## 5. Gráficas y resultados

Cada gráfica muestra automáticamente el primer y segundo lugar al concluir la final. Los dos terceros lugares salen de las semifinales: uno es quien enfrentó al campeón y el otro quien enfrentó al subcampeón. Si todavía no hay una semifinal concluida, su lugar queda pendiente.

Pulsa **EXPORTAR PDF** desde la lista o el detalle de una gráfica. Se genera un PDF horizontal de una página con proporción 16:9, renderizado desde el HTML de la gráfica, con las rondas grandes y los resultados disponibles.

## 6. Respaldos y cambio de computadora

1. En **ADMIN**, pulsa **EXPORTAR RESPALDO (JSON)**.
2. Guarda el archivo en una ubicación segura.
3. En otra computadora instala la aplicación y usa **IMPORTAR RESPALDO**.

El archivo incluye eventos, nombre y logo, competidores, gráficas, resultados, notas de kata y el estado parcial de kumite. Importarlo reemplaza los datos locales existentes en esa computadora. Así puedes trasladar el evento y continuar allí; los equipos no sincronizan ni combinan cambios entre sí.

## 7. Datos y privacidad

Los datos se guardan localmente en el perfil de la aplicación. El marcador TV se sincroniza con el operador mediante un canal local. Algunas funciones auxiliares cargadas desde CDN requieren conexión a Internet.

## 8. Soporte de instalación

- Si Windows muestra SmartScreen, comprueba que el instalador sea el descargado desde el release oficial.
- Si faltan estilos o recursos al ejecutar desde código fuente, instala dependencias con `npm ci`.
- Para desarrollo: `npm start`.
- Para generar una nueva distribución Windows: `npm run make`.
