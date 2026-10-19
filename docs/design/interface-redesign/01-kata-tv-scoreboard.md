# Rediseño de interfaz — Historia inicial: Kata TV Scoreboard

**Rama:** `interface-desing`
**Estado:** implementada en `interface-desing`; montada en localhost para revisión visual.
**Referencia:** mockup compartido por el propietario.

## Objetivo

Rediseñar la vista pública de Kata TV para presentar, de forma legible a distancia, el tatami, categoría/división, competidor, municipio, lado/color, kata y logo del torneo. Esta historia es el primer incremento del rediseño general; no incluye todavía el operador de kata, kumite ni el resto de la aplicación.

## Historia de usuario

> Como público, árbitro y competidor, quiero ver en la pantalla de Kata TV quién está ejecutando, de qué municipio es, en qué división participa, qué kata presenta y a qué lado/color pertenece, para identificar claramente la actuación durante el torneo.

## Distribución propuesta según el mockup

1. **Franja superior:** nombre y número de tatami.
2. **Franja de categoría:** categoría/edad y división varonil/femenil, usando los datos del encuentro o de la selección de categoría libre.
3. **Bloque del atleta:** nombre del competidor.
4. **Identidad municipal:** cuadro o escudo a la izquierda y nombre del municipio junto a él. Hasta recibir los archivos oficiales, mostrar el código existente (por ejemplo `TAM`, `REY`, `VIC`) como placeholder visual.
5. **Indicador de lado:** panel del atleta rojo para AKA y azul para AO. En encuentros de gráfica, AKA es la primera actuación y AO la segunda.
6. **Identidad de torneo:** espacio para el logo personalizado del evento seleccionado.
7. **Kata:** mostrar número de catálogo y nombre en campos separados, sin guion: `001` y `Anan`.

## Reglas de catálogo y compatibilidad

- Los 102 elementos actuales conservan su orden e identidad; la numeración visual queda zero-padded a tres dígitos (`001` a `102`).
- La lista de selección debe presentar número y nombre sin el formato actual `1 - Anan`.
- La plantilla TV presenta el número y el nombre como elementos distintos.
- Al planificar implementación se inspeccionará la persistencia de `kata1`, `kata2` y `kataName`; no se reescribirán gráficas o respaldos históricos sin necesidad. La lectura de valores existentes debe seguir resolviendo el kata correcto.
- En kata libre, el operador seleccionará explícitamente rojo/AKA o azul/AO para la actuación; la TV reflejará esa selección.

## Criterios de aceptación

- [x] Se implementó la jerarquía visual del mockup en la vista Kata TV.
- [x] Se muestran tatami, categoría, división, competidor, municipio, lado/color, kata y logo del evento cuando estén disponibles.
- [x] El municipio usa el código como placeholder mientras no existan logos municipales asociados.
- [x] AKA se presenta en rojo y AO en azul en encuentros de gráfica.
- [x] El selector y la TV presentan numeración visual de tres dígitos y nombre sin guion.
- [x] La persistencia histórica conserva los strings de kata existentes; la presentación resuelve ambos formatos.
- [x] Si falta logo municipal, se conserva el código; si falta logo del torneo, se usa el logo AKT.
- [x] Se agregaron fallbacks para valores vacíos de competidor, municipio y kata.
- [x] El logo del evento se guarda localmente por ID de evento y se sincroniza a la TV.
- [ ] Revisión visual final de actuación libre, gráfica AKA/AO, cronómetro, votos y resultado en 1280×720 y 1920×1080.

## Datos existentes y brechas

- `municipios` en `index.html` contiene nombre y código para Tampico, Reynosa, Victoria, Matamoros, Madero, Altamira y Nuevo Laredo; el repositorio no tiene imágenes para estos municipios.
- `kataState.countryName` actualmente representa el municipio, no un país. En el diseño nuevo se debe rotular como municipio y evitar la palabra “country” en labels internos visibles.
- `kataState.countryCode` guarda el código municipal actual.
- `globalState.tatami` contiene un número; no existe un campo independiente de nombre de tatami.
- `eventForm` tiene nombre, fechas, ubicación y descripción, pero no logo; `currentEvent` representa el evento activo.
- `officialKatas` es una lista de strings con formato `número - nombre`.
- Para el marcador de gráfica, `matchStep` indica primera/segunda actuación y `p1`/`p2` representan AKA/AO.

## Decisiones confirmadas para el prototipo

1. **Tatami:** mostrar `TATAMI` y el número actual; no se agregan nombres separados.
2. **Logo del torneo:** aceptar PNG, JPG y SVG; guardar una copia local asociada al evento, sin depender de la ruta original. SVG deberá validarse antes de mostrarlo.
3. **Kata libre:** agregar una selección explícita en el operador para el lado/color (AKA/rojo o AO/azul); TV reflejará el valor elegido.
4. **Dimensiones:** revisar el primer prototipo en 1280×720 y 1920×1080.

## Verificación local

- `npm run build:css`: correcto.
- Sintaxis del módulo JavaScript inline: correcta (`node --check`).
- `git diff --check`: correcto.
- `http://127.0.0.1:4173/index.html`: responde HTTP 200 y contiene la nueva vista Kata TV.
- La revisión visual interactiva queda pendiente de hacer en un navegador conectado.

## Fuera de alcance de esta historia

- Cambiar el estilo visual de los operadores.
- Rediseñar Kumite TV.
- Rediseñar navegación, administración o formularios generales, salvo añadir el campo de logo de evento como dato requerido para este scoreboard.
- Descargar logos municipales de Internet; se usarán códigos hasta recibir los assets aprobados.
- Cambiar la adjudicación de votos, temporizadores o reglas deportivas.
