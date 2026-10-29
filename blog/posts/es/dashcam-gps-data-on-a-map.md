---
title: Cómo ver los datos GPS de la dashcam en un mapa
description: La mayoría de las dashcams con GPS esconden la posición y la velocidad dentro del archivo de vídeo. Dónde se guardan, qué marcas usan cada formato y cómo ver la ruta junto al vídeo.
date: 2026-10-29
updated: 2026-10-30
---

Una dashcam con GPS registra dónde estabas y a qué velocidad ibas, cada segundo. Eso puede ser muy importante después de un incidente: demuestra que tu velocidad estaba dentro del límite, o dónde ocurrió exactamente algo. Pero no encontrarás un archivo GPS aparte en la tarjeta. Los datos están ocultos dentro de los vídeos.

## Dónde se guardan los datos GPS

| Marca | Cómo se guarda el GPS |
|---|---|
| Viofo y otras cámaras basadas en Novatek | Dentro del archivo MP4, en un bloque que suele llamarse "freeGPS" |
| BlackVue | Sentencias NMEA dentro del archivo MP4 |
| Thinkware | Dentro del archivo, en el formato propio de Thinkware |
| Nextbase | Dentro del archivo, en el formato propio de Nextbase |
| Garmin | Dentro del archivo, en el formato propio de Garmin |
| GoPro | Una pista de telemetría aparte (GPMF) en el archivo, con altitud y acelerómetro |
| Tesla | No se guarda en los archivos de la dashcam |

Un reproductor de vídeo normal ignora por completo estos datos. Necesitas software que sepa dónde buscar.

## Ver la ruta junto al vídeo

[Tripframe](/app/) lee el GPS de archivos de **Viofo / Novatek**, **BlackVue** y **GoPro**.

1. Abre la tarjeta en Tripframe.
2. Abre un clip y pulsa `G`, o haz clic en **Mapa**.

Junto al vídeo aparece un mapa con la ruta del clip. Una flecha sigue al coche mientras se reproduce el vídeo, con la velocidad, el rumbo y la distancia debajo del mapa, en km/h o mph. Cambia entre vista de mapa, satélite e híbrida, y colorea la ruta según la velocidad. Pulsa `R` para grabar el vídeo y el mapa juntos en un solo archivo.

Debajo del mapa, unos gráficos muestran la velocidad, la distancia, el rumbo y, cuando la cámara los registra, la altitud, la pendiente, la fuerza G y los satélites. Haz clic en un gráfico para saltar a ese momento. Pulsa `T` para poner un marcador en la ruta, y `H` para mostrar los datos de conducción sobre el propio vídeo.

Las imágenes del mapa vienen de OpenStreetMap y, en las vistas de satélite, de Esri. El tiempo y las direcciones solo se consultan si lo activas. Tus vídeos y tus datos GPS se quedan en tu ordenador.

## Exportar los datos GPS

¿Necesitas la ruta como archivo? Debajo del mapa en Tripframe, elige **GPX** (para la mayoría de apps de mapas y deporte), **KML** (para Google Earth), **CSV** (una hoja de cálculo con hora, posición, velocidad, rumbo y altitud de cada punto) o **GeoJSON** (para herramientas GIS). Para las marcas que Tripframe todavía no puede leer, usa un programa de escritorio como Dashcam Viewer o Registrator Viewer. Consulta [el mejor software de dashcam](/blog/best-dashcam-software/).

## ¿No aparece el GPS?

- Comprueba que el GPS está activado en los ajustes de la cámara y que el soporte o módulo GPS está conectado.
- Los primeros minutos tras el arranque pueden no tener GPS mientras la cámara encuentra satélites.
- Tu marca puede usar un formato que Tripframe todavía no lee; el vídeo se reproduce con normalidad.
