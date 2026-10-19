# Rediseño de interfaz — Historia 02: Kumite TV Scoreboard

**Rama:** `interface-desing`
**Estado:** iteración ajustada a la user story y referencia adjuntas; disponible en localhost para revisión.
**Predecesora:** `01-kata-tv-scoreboard.md`.

## Objetivo

Rediseñar la vista pública de Kumite TV para que el público pueda reconocer a cada competidor, distinguir AKA y AO, leer el puntaje y las penalizaciones, identificar Senshu y seguir el tiempo del combate desde distintas distancias.

## Historia de usuario

> Como público, árbitro y competidor, quiero seguir claramente el combate, los puntajes, las penalizaciones y el tiempo restante, para entender su estado sin depender de la pantalla del operador.

## Alcance propuesto

- Rediseñar exclusivamente el scoreboard de Kumite en modo TV.
- Conservar el uso de datos existentes: evento, categoría, tatami, nombres y códigos de competidores, puntajes, penalizaciones, Senshu, ganador y cronómetros de combate/tiempo médico.
- Usar el fondo oscuro enmarcado de Kata TV; conservar además los brillos localizados de los paneles de puntaje, el reloj, el rótulo PENALTIES y las líneas.
- Mostrar en un cuadro blanco el mismo logo del evento que usa Kata TV; si no hay logo configurado, usar el fallback AKT de Kata TV.
- Revisar el resultado a 1280×720 y 1920×1080.

## Distribución propuesta

1. **Identificación superior:** barra roja y país/municipio AKA a la izquierda; barra azul y país/municipio AO a la derecha.
2. **Competidores:** apellido destacado y nombre debajo; AKA a la izquierda y AO a la derecha.
3. **Puntaje:** contenedores cuadrados rojo y azul, números blancos grandes y brillo localizado.
4. **Penalizaciones:** indicadores compactos y distinguibles para C1, C2, C3, HC y H; Shikkaku continúa identificándose por separado.
5. **Bajo los puntajes:** penalizaciones de AKA y AO alineadas a cada lado, con rótulo PENALTIES al centro.
6. **Franja inferior:** información de tatami/categoría/peso y logo del evento, cronómetro centrado, ronda y número de combate a la derecha.
7. **Senshu:** triángulo verde con “S” en la esquina inferior derecha del cuadro de puntaje correspondiente.

## Reglas y compatibilidad

- AKA sigue correspondiendo al competidor rojo y AO al azul.
- No se modifican puntuación, temporizadores, penalizaciones, Senshu, Shikkaku ni criterios para declarar ganador.
- La TV solo representa el estado que ya produce el operador; no agrega controles ni cambia el flujo del combate.
- No se modifica el operador de Kumite ni otros modos de pantalla.
- Los nombres largos y códigos vacíos deben conservar una presentación legible, sin desbordar el diseño.

## Criterios de aceptación

- [x] La pantalla presenta categoría y tatami; categoría, división, peso, ronda y número se enlazan a los datos de la gráfica.
- [x] AKA y AO se distinguen por posición, etiqueta y color (rojo/azul).
- [ ] Nombres y códigos de ambos competidores se revisan visualmente en 1280×720 y 1920×1080.
- [x] Puntajes, penalizaciones, Senshu y Shikkaku reflejan el estado existente sin alterar reglas; Senshu aparece en un triángulo verde en la esquina inferior derecha.
- [x] El cronómetro y el tiempo médico se distinguen claramente.
- [x] El fondo oscuro y el marco de Kumite TV siguen el tratamiento de Kata TV; no se usa transparencia general.
- [x] Kumite TV comparte el logo de evento de Kata TV y su fallback AKT.
- [ ] Confirmar visualmente nombres divididos, datos de municipio y datos de ronda.
- [ ] Validar visualmente los datos vacíos y nombres largos.
- [x] La vista mantiene una composición adaptable; falta revisión interactiva en resoluciones objetivo.
- [ ] Confirmar que operador, modo Kata y lógica deportiva no sufren regresiones.

## Decisiones de la referencia recibida

- Se sigue la composición y el orden de la imagen compartida; AKA a la izquierda, AO a la derecha y cronómetro centrado abajo.
- Tatami se muestra como `TATAMI` y usa el número configurado.
- Categorías se abrevian como `U12`, `U14`, `U21`, `CAD`, `JUN` y `SEN`; la división usa abreviaturas y el peso muestra solo la clase (por ejemplo, `-47 kg`).
- El nombre de combate muestra la ronda numérica (por ejemplo, `RONDA 2`) y el número de combate se toma de la gráfica.
- Las penalizaciones se muestran debajo de los puntajes, con los activos en amarillo brillante y el rótulo `PENALTIES` centrado.
- Senshu se representa como triángulo verde con “S” en la esquina inferior derecha.
- Se usa el fondo oscuro y el marco de Kata TV; no se usa transparencia general.
- Kumite TV reutiliza el logo cargado desde el Admin de Kata TV y el mismo fallback AKT.

La implementación sigue la composición descrita y queda disponible para review.

## Verificación

- `npm run build:css`: correcto.
- Sintaxis del módulo JavaScript inline: correcta (`node --check`).
- `git diff --check`: correcto.
- Revisión visual interactiva en 1280×720 y 1920×1080: pendiente.
