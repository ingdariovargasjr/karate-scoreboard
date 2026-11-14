# Mejoras de la rama `olimpiada-nacional-mejoras`

Esta rama reúne mejoras del registro local, las gráficas y los operadores de kata y kumite. La versión de entrega es **1.5.0**.

## Cambios incluidos

- **Eventos y respaldo entre equipos:** crear y personalizar eventos en local; exportar e importar JSON con eventos, nombre y logo, competidores, gráficas, resultados y progreso parcial. La transferencia se hace manualmente; no hay sincronización en red.
- **Gráficas y podio:** imprimir el HTML de cada gráfica en un PDF horizontal 16:9 de una página. Al terminar la final se muestran campeón, subcampeón y los dos terceros lugares, tomados de las semifinales del campeón y del subcampeón.
- **Operadores de kata y kumite:** Kiken AKA/AO o del competidor asigna automáticamente el triunfo al oponente. En kata por equipo, el segundo clic del aviso de 35 segundos lo oculta e inicia el reloj de 5 minutos; al detener los relojes, se quitan del scoreboard.
- **Puntuación en kumite TV:** Yuko, Waza-ari e Ippon se anuncian a pantalla completa durante 1.5 segundos con el color de AKA/AO e iconos SVG transparentes de técnicas, con cintas y guantes negros.
- **Olimpiada Nacional:** reglas de peso por rama y edad para 14–15, 16–17 y 18–20 años. Cada límite `-X kg` admite hasta `X.00 kg`; desde `X.01 kg` corresponde al siguiente límite o al grupo `+X kg`.

## Tabla de límites

| Edad | Femenil | Varonil |
| --- | --- | --- |
| 14–15 (2013–2012) | -47, -54, -61, +61 kg | -52, -57, -63, -70, +70 kg |
| 16–17 (2011–2010) | -48, -53, -59, -66, +66 kg | -55, -61, -68, -76, +76 kg |
| 18–20 (2009–2007) | -50, -55, -61, -68, +68 kg | -60, -67, -75, -84, +84 kg |

## Validación

- `npm test`: **24 pruebas pasaron**, incluidos los 23 cortes en `X.00` y `X.01` y entradas inválidas.
- Interfaz en Microsoft Edge: en 14–15 femenil, `47.00 kg` muestra `-47kg` y `47.01 kg` cambia a `-54kg`. No se guardó competidor de prueba.
- `git diff --check` pasó.
- `npm run make` terminó correctamente con Electron Forge en Windows x64 y generó el instalador `Karate Scoreboard AKT-1.5.0 Setup.exe`, `karate-scoreboard-akt-1.5.0-full.nupkg` y `RELEASES`.
- Se generó desde el paquete Forge el portable `Karate.Scoreboard.AKT-1.5.0-portable-win32-x64.zip`.
