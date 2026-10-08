# Impacto transversal, riesgos y plan incremental

**Estado:** plan incremental completo: KO-01/02/03/04/05/06/07, KT-01/02, KA-01/02/03 y el desempate global implementados y aprobados. El inventario completo con IDs y referencias está en [00-alcance-y-trazabilidad.md](00-alcance-y-trazabilidad.md); el comportamiento condicionado está en los tres documentos de módulo.

## Archivos y acoplamientos

| Componente | Cambios posibles después de aprobar el alcance |
| --- | --- |
| `index.html:791-1098` | Plantillas del operador kata y kumite; controles, accesibilidad y estado presentado. |
| `index.html:1200-1333` | Plantillas externas kata y kumite; estado visible, indicadores y temporizadores. |
| `index.html:1550-1574,1603-1707` | Estado Vue, atajos, deep links y `BroadcastChannel` para ambas ventanas. |
| `index.html:1855-1950,1978-2050` | Flujo de gráficas, puntuación, sanciones, senshu, ganadores y temporizadores; nuevo criterio de kata por votos y diseño de persistencia de notas por juez. |
| `input.css`, `css/output.css`, `tailwind.config.js` | Estilos fuente, CSS generado **versionado** y escaneo de clases. No tocar solo `css/output.css`. |
| `main.js`, `forge.config.js` | **Sin cambio previsto**; revisar únicamente si se confirma comportamiento de ventanas que el HTML no pueda resolver. |
| `login.html`, `experimentals/`, Firebase | Fuera de alcance: la aplicación activa es `index.html` local. La expulsión sí debe aplicarse en kumite y kata del torneo, pero eso no autoriza cambios en estas páginas alternativas ni despliegues. |

## Riesgos de regresión y pruebas enfocadas propuestas

| Riesgo | Escenarios a comprobar antes de dar un incremento por terminado |
| --- | --- |
| Posición de paneles mal asociada | AKA/AO con nombres, códigos, puntos, sanciones, senshu y ganador distintos; verificar operador **azul izquierda/rojo derecha** desde el inicio, TV **sin invertir**, atajos ligados al color lógico y ganador guardado en gráfica. No se pidió control de invertir/deshacer. |
| Descontar puntos altera decisión | Probar `-1` en 0, tras Yuko/Waza/Ippon, diferencia de 8, al expirar tiempo y después de ganador; comparar marcador con contadores de técnicas. |
| Penalizaciones/Senshu/Shikkaku cambian significado | Alternar C1/C2/C3/HC/H, Hansoku confirmado, retirada y reasignación de Senshu a `15.9` y por HC; diferenciar `S` roja de Shikkaku y verde de Senshu. Shikkaku excluye de **kumite y kata restantes del torneo**; adjudica el encuentro actual y los futuros afectados según las inscripciones vinculadas manualmente. |
| Relojes con intervalos concurrentes o unidades mezcladas | Stop combate → médico 3:00 **en sustitución en TV** → Terminar/Reset/cero médico → combate **aún pausado** → Start manual; kumite corriendo amarillo, Atoshi rojo desde `15.9`, toda pausa blanco. Kata: 35 s → pulsar 5:00 detiene 35 s y arranca 5:00, o 5:00 directo, sin simultaneidad; ambos relojes amarillos y rojos intermitentes en los últimos 15 s **solo en TV**, con último color estable en pausa y cero. `openMatchOperator` ya convierte segundos a ms. |
| Kata pierde resultados o adjudica mal | Dos atletas con 5/7 notas, juez empatado da **un voto a cada lado**, ventaja por mayoría, empate global, MOSTRAR, SEGUNDO COMPETIDOR, RESET y reapertura de gráfica. El código aún compara totales; los encuentros antiguos solo guardan esos totales. El TV no debe filtrar notas/votos por juez ni sumas. |
| Diseño TV pierde legibilidad | Verificar capturas a resolución de uso acordada, ambas columnas y estado activo/inactivo sin superposiciones; verificar CSS regenerado. |

`npm test` falla intencionalmente (placeholder); no hay CI ni linter configurados. Para cada incremento aprobado: `npm run build:css`, inspección en navegador desde localhost de operador y TV simultáneos y lista de escenarios de la fila correspondiente. Electron queda para la revisión final de todas las historias. Decidir después si se añaden pruebas automatizadas de lógica de estado/tiempo: hoy esa lógica está en el módulo inline de `index.html`, sin infraestructura de pruebas. No declarar verificaciones no ejecutadas.

## Orden recomendado y tareas

0. **Cerrar solo decisiones restantes:** el desempate global ya quedó definido como corrección de cualquier nota existente hasta obtener mayoría; no crea ronda ni juez adicional. KA-03 retira sumas visibles y publica únicamente totales de votos en TV en los momentos aprobados. KO-07 y KA-01 ya tienen ciclos definidos; KO-05 Shikkaku adjudica el combate al rival, excluye las inscripciones vinculadas **manualmente** de ambas modalidades y admite corrección antes de nuevos resultados.
1. **Línea base y corrección autorizada de unidades:** capturas de operador/TV y datos de prueba; `openMatchOperator` ya usa ms desde KT-02. Verificar combate libre y desde gráfica con 3:00/2:00/1:30 sin mezclar cambios deportivos no aprobados.
2. **Incrementos de operador kumite ya implementados** (KO-01/02/03/04/05/06). Paneles azul izquierda/rojo derecha **solo en operador**, orden +3/+2/+1/-1, rótulos fuera, Senshu bajo cada lado y Shikkaku compacto. KO-05 se verificó en navegador y espera revisión del propietario; no afecta el tamaño/color amarillo de C1–H en TV, reservado a KT-01.
3. **Relojes/TV:** KT-01/02 y KO-07 revisadas: Stop combate → médico sustituye en TV → Terminar/Reset/cero médico devuelve combate pausado → Start manual. `S` roja/verde y exclusión en futuras gráficas de **kumite y kata** ya pertenecen a KO-05.
4. **Incrementos kata independientes:** KA-01/02/03 y el desempate global revisados y aprobados: sin sumas visibles en operador, TV o tarjetas de gráfica kata; votos totales en TV solo al finalizar una gráfica o completar notas en libre, sin divulgar jueces individuales. Un empate exige corregir cualquier nota y volver a comparar antes de avanzar.
5. **Kata TV:** asegurar que no se muestren notas ni votos por juez; mostrar votos totales y ganador oficial solo según el flujo confirmado. El reloj visible tiene prioridad sobre los votos; encuentros antiguos sin notas muestran ganador guardado, nunca votos inventados.
6. **Cierre:** repetir escenarios completos, `npm run build:css`, comprobar `css/output.css`, actualizar documentación del usuario según funciones realmente entregadas y presentar capturas para aceptación. El empaquetado con `npm run make` se reserva a la verificación final si se aprueba.

**Punto de control:** todas las historias están aprobadas. Corresponde la verificación final completa en navegador y después Electron; no se incorporan cambios funcionales nuevos sin una nueva solicitud.
