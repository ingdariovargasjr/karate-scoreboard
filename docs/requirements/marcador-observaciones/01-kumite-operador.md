# Especificación preliminar — operador de kumite (página 1)

**Fuente:** [PDF P1](../OBSERVACIONES%20MARCADOR.pdf), [captura P1](../observacion-marcador-1.png) y aclaraciones posteriores del propietario. **Estado:** KO-01/02/03/04/05/06/07 implementadas y aprobadas. Q-KO identifica dudas solo donde se señalan expresamente.

## KO-01 — «Invertir colores»

- **Decisión confirmada:** cambiar **solo la posición visual por defecto en el operador**: AO/azul a la izquierda, AKA/rojo a la derecha, desde la perspectiva del operador de frente. La asignación de color a cada atleta no cambia; tampoco la disposición del TV ni los atajos por color. Hoy la pantalla de operador tiene AKA a la izquierda y AO a la derecha (`index.html:956-1097`). No se pidió botón de alternancia.
- **CA:** al entrar en kumite (libre o desde gráfica), ambos paneles de operador aparecen en la posición pedida; nombre, puntuación, sanciones y Senshu siguen perteneciendo a su respectivo color lógico. Con los mismos puntos de entrada, el TV conserva su disposición previa y los atajos AKA/AO su significado; `finishKumiteMatch` sigue asignando ganador al atleta correcto.
- **Impacto:** maquetación de `index.html:956-1097`, controles relacionados y pruebas de gráfica/TV; **sin** intercambio de propiedades de `kumiteState`, mapeo de atajos ni posiciones del TV.

## KO-02 — «Botón Senshu»

- **Decisión confirmada:** mover, **no duplicar**, los dos botones de asignación: uno «Senshu» bajo el competidor AKA y otro bajo AO. El control «Remove Senshu» se sitúa bajo el **competidor que tiene Senshu**; solo hay uno visible a la vez. `S` de penalizaciones significa Shikkaku, distinta de la `S` verde de Senshu en TV. Después de asignar Senshu, **retirar y reasignar directamente al rival** se desbloquean al entrar en **15.9 segundos**; sigue vigente la excepción actual por HANSOKU CHUI. La versión anterior de `isRemoveSenshuEnabled` usaba `<=15000` ms y `setSenshu` exigía retirar primero (`index.html` antes de KO-02).
- **CA:** cada lado tiene un solo botón Senshu bajo su atleta; antes de `15.9` no se puede retirar ni pasar al rival salvo por HC. Desde `15.9` el botón «Remove Senshu» bajo el atleta asignado se habilita y pulsar Senshu del otro atleta **transfiere directamente** la asignación, sin dejar marcas en ambos lados. Después de HC se permiten las mismas acciones según la excepción vigente. Probar `16.0`, `15.9`, HC y Reset.
- **Impacto:** paneles laterales, `senshu`/`senshuTriggered`, `isRemoveSenshuEnabled`, `setSenshu`/`removeSenshu` y TV; distinguir estado/etiqueta de Senshu frente a Shikkaku.
- **Q-KO-02 resuelta:** «Remove Senshu» bajo el atleta asignado y transferencia directa al pulsar el Senshu del rival cuando esté desbloqueado. Se conserva la excepción HC.

## KO-03 — «Invertir orden»

- **Necesidad observable:** cambiar el orden visual de YUKO +1, WAZA +2, IPPON +3 del bloque señalado (`969-972`); AO replica ese orden (`1068-1071`).
- **Decisión confirmada:** en **ambos** lados el orden visible es Ippon +3 → Waza-ari +2 → Yuko +1 → botón `-1` reubicado (KO-04). La asignación actual de atajos por color/técnica no cambia; el modal puede conservar la enumeración actual si no se pide otra cosa.
- **CA:** cada columna del operador muestra ese orden, una pulsación de cada botón registra el valor/técnica correspondiente; los atajos existentes siguen ejecutando la técnica asignada, sin remapeo por posición.
- **Impacto:** plantilla AKA/AO; posible espaciado en `input.css:25-35` y CSS generado.

## KO-04 — «Botón que diga -1»

- **Necesidad observable:** botón `-1` situado bajo la puntuación del lado señalado. Hoy `-1 PUNTO` ya existe en las secciones «Quitar Puntos» de AKA y AO (`982-989`, `1081-1088`).
- **Decisión confirmada:** reubicar y rotular `-1` el control `-1 PUNTO` **existente** bajo los tres botones de anotación de **cada** lado, sin duplicarlo ni cambiar su función `removePoints(side, 0)`.
- **Ajuste posterior solicitado:** retirar por completo del operador las secciones «Quitar Puntos (AO)» y «Quitar Puntos (AKA)», incluidos los botones «- YUKO», «- WAZA-ARI», «- IPPON» y los contadores visibles de técnicas. Conservar `-1` debajo de Yuko en ambos lados y la lógica interna de puntuación; la TV no cambia.
- **CA:** `-1` resta uno del color correspondiente solo si la puntuación es positiva, no produce negativos y mantiene la semántica actual de contadores/ganador; las antiguas secciones «Quitar Puntos» y sus otros controles ya no se muestran.
- **Impacto:** reubicación UI; pruebas de lógica existente (`2018-2030`, `1987-1997`), pero no una nueva regla de cálculo.

## KO-05 — Penalizaciones compactas

- **Decisión confirmada:** controles compactos `C1`, `C2`, `C3`, `HC`, `H`, `S` bajo **ambos** competidores. `S` es **Shikkaku**: el rival gana de inmediato aun si iba perdiendo; el expulsado deja de competir en el resto del torneo, **tanto kumite como kata**. Sus rivales avanzan automáticamente en futuros encuentros aún no disputados, pero se conservan los resultados históricos. En TV Shikkaku es `S` roja **junto a C1–H** y Senshu `S` verde **sobre los puntos**. Los botones centrales anteriores «SHIKKAKU AKA/AO» no tenían acción y se reemplazan por `S` a cada lado.
- **Identificación y corrección confirmadas:** antes de aplicar la sanción, el operador selecciona manualmente las otras inscripciones de la **misma persona** para vincular modalidades/categorías con IDs distintos; nunca vincular por nombre automáticamente (homónimos). El diálogo y la confirmación explícita preceden a la expulsión. Puede corregirse mientras **no se registren resultados nuevos**; se restauran elegibilidad y adjudicaciones automáticas sin eliminar historial. En combate libre sin inscripción seleccionada, la marca y la victoria afectan solo ese combate: **no** expulsan automáticamente de otras gráficas.
- **CA:** C1/C2/C3/HC/H mantienen sus acciones con rótulo corto y nombre accesible completo; `S` queda separada de Senshu en operador/TV. Aplicar Shikkaku detiene el combate, deja ganador al rival y persiste las inscripciones seleccionadas como inelegibles en ambas modalidades; futuras gráficas con rival conocido lo hacen avanzar, sin anticipar un ganador si el rival aún no se determina. Si se intenta abrir uno de esos encuentros, se bloquea. Deshacer antes de cambios posteriores restaura las gráficas previas y la elegibilidad. Verificar atleta inscrito en kumite y kata, homónimo no seleccionado, rival pendiente, combate libre, recarga y respaldo.
- **Impacto:** sanciones del operador, ganador y propagación de gráficas (`finishKumiteMatch`, `finishKataMatch`, `BracketSystem`), inscripciones y estado local persistido, respaldos, TV y estilos (`css/output.css`). No se agregó atajo de Shikkaku porque no se solicitó.

## KO-06 — Dos «BORRA» sobre AO

- **Decisión confirmada:** retirar únicamente los **cuatro rótulos** `AKA Score`, `AKA Penalties`, `AO Score`, `AO Penalties` en la interfaz del operador (`969`, `975`, `1068`, `1074`), sin borrar botones ni datos y sin modificar TV.
- **CA:** los cuatro textos ya no aparecen visualmente; puntos y penalizaciones de ambos lados continúan operables e inequívocos mediante sus paneles AKA/AO; conservar identificación accesible de controles al retirar encabezados visuales.
- **Impacto:** plantilla y espaciado de ambas columnas del operador; revisión de accesibilidad.

## KO-07 — Cronómetro médico de 3 minutos

- **Decisión confirmada:** reloj médico **independiente de 3:00** bajo Hantei. El operador debe **iniciar y detener un combate** antes de poder iniciar atención; pulsar médico no pausa automáticamente el combate. La TV sustituye el reloj de combate congelado por el médico rotulado **«TIEMPO MÉDICO»**, en **blanco** mientras corre, incluso si se abre tarde. No hay pausa/reanudación médica: solo **Iniciar médico**, **Terminar médico** y **Reset médico**. Terminar o Reset devuelve la TV al combate aún pausado y prepara el médico en 3:00; al llegar a cero se produce el mismo retorno **automáticamente**. Solo Start del combate lo reanuda manualmente.
- **Durante la atención:** bloquear Start/Stop/Reset y ajustes del reloj de combate, cambio de color, Reset Bout, adjudicación/finalización, Shikkaku/Hansoku y cambio de encuentro/modalidad. Se permiten correcciones de puntos y sanciones **que no decidan el encuentro**: impedir una corrección que produzca ventaja de 8 puntos; el combate no declara ganador durante el médico. La `S` de Senshu y C1–HC conservan su función; «Cambio de color (5:00)» no reutiliza el reloj médico.
- **CA:** Stop congela el combate y habilita iniciar médico; este comienza en 3:00 y se ve en operador y en lugar del combate en TV, con rótulo blanco. Terminar, Reset médico o llegar a cero vuelven al combate con su misma lectura pausada, sin adjudicar ganador ni reanudarlo; un nuevo ciclo médico comienza otra vez en 3:00 tras Start/Stop del combate. Probar TV abierta tarde, controles bloqueados, correcciones no finales y límite de 8 puntos.
- **Impacto:** estado/intervalo médico propio, `checkAutoWin`, `resetTimer`, `startColorChange`, sincronización por `BroadcastChannel`, plantillas operador/TV y atajos existentes de Start/Stop. No se agregó atajo médico.
