# Guía rápida de usuario — Karate Scoreboard AKT

## 1. Primer inicio

1. Abre la aplicación desde el menú Inicio.
2. Registra competidores en **ADMIN**.
3. Revisa modalidad, categoría, municipio y, para kumite individual, peso.
4. En kata, selecciona **5 o 7 jueces** antes de generar las gráficas.
5. Pulsa **GENERAR GRÁFICAS**.

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
3. Usa **INICIAR (35s)** para el inicio o **INICIAR (5:00)** para el reloj de equipo.
4. Captura las notas en la fila roja AKA y la azul AO.
5. En un encuentro de gráfica, captura AKA, pulsa **SIGUIENTE COMPETIDOR** y captura AO.
6. Un juez empatado otorga un voto a cada atleta.
7. El ganador se decide por mayoría de votos, no por suma de notas.
8. Si hay empate global, corrige cualquier nota y vuelve a comparar. No se puede finalizar mientras continúe el empate.

## 4. Marcador TV

- Abre la TV desde el botón del operador; no abras `index.html` con `file://`.
- TV kumite muestra nombres, puntos, penalizaciones y reloj sincronizados.
- TV kata no muestra notas individuales ni votos por juez.
- TV kata muestra votos totales al finalizar una gráfica o completar una actuación libre.
- Mientras un reloj de kata está visible, el reloj tiene prioridad sobre los votos.

## 5. Respaldos y cambio de computadora

1. En **ADMIN**, pulsa **EXPORTAR RESPALDO (JSON)**.
2. Guarda el archivo en una ubicación segura.
3. En la nueva computadora instala la aplicación y usa **IMPORTAR RESPALDO**.

El respaldo incluye competidores y gráficas. No incluye eventos; vuelve a configurarlos si tu flujo los utiliza.

## 6. Datos y privacidad

Los datos se guardan localmente en el perfil de la aplicación. El marcador TV se sincroniza con el operador mediante un canal local. Algunas funciones auxiliares cargadas desde CDN requieren conexión a Internet.

## 7. Soporte de instalación

- Si Windows muestra SmartScreen, comprueba que el instalador sea el descargado desde el release oficial.
- Si faltan estilos o recursos al ejecutar desde código fuente, instala dependencias con `npm ci`.
- Para desarrollo: `npm start`.
- Para generar una nueva distribución Windows: `npm run make`.
