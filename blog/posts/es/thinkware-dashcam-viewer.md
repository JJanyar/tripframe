---
title: "Cómo ver las grabaciones de una dashcam Thinkware en PC y Mac"
description: "Thinkware reparte las grabaciones en carpetas como cont_rec, evt_rec y parking_rec. Así puedes verlas todas en una sola línea de tiempo, con delantera y trasera juntas, en tu navegador."
date: 2026-10-29
---

Las dashcams Thinkware, como la U3000, la Q1000 y la F70 Pro, son populares por su modo aparcamiento asistido por radar y su sólida calidad de imagen. Thinkware ofrece el **Thinkware Dashcam Viewer** para Windows y Mac y una app para móvil. Si prefieres no instalar software, o estás en un ordenador que no es tuyo, hay una vía más rápida.

## Cómo guarda Thinkware las grabaciones

Una tarjeta Thinkware se divide en carpetas según el tipo de grabación:

- `cont_rec` para la conducción continua
- `evt_rec` para incidentes detectados por el sensor G
- `manual_rec` para los clips guardados con el botón
- `parking_rec` y `motion_timelapse_rec` para el modo aparcamiento

Los nombres de archivo tienen este aspecto:

`REC_2024_03_15_14_30_22_F.MP4`

El prefijo (`REC`, `EVT`, `MAN`, `MOT`, etc.) es el tipo, seguido de la fecha y la hora, y luego `F` o `R` para la cámara delantera o trasera.

Como las carpetas dividen un trayecto en varias listas, es difícil ver lo ocurrido en orden. Un clip de evento está en una carpeta y los minutos anteriores en otra.

## Una sola línea de tiempo con Tripframe

[Tripframe](/) lee los nombres y las carpetas de Thinkware y vuelve a poner cada clip en una única línea de tiempo por día.

1. Pon la tarjeta microSD en tu ordenador.
2. Abre [la app](/app/) en Chrome o Edge.
3. Elige la tarjeta.

Los clips de evento, manuales y de aparcamiento siguen etiquetados, así que puedes filtrarlos, pero quedan entre los clips normales, que es donde les corresponde. La delantera y la trasera se reproducen juntas; pulsa `1`, `2` o `3` para cambiar entre lado a lado, imagen en imagen y una sola cámara.

## Avance fotograma a fotograma para las matrículas

Las cámaras delanteras 4K de Thinkware captan mucho detalle, pero por el desenfoque de movimiento solo uno o dos fotogramas salen nítidos. Pausa y avanza con las teclas de coma y punto hasta que la matrícula sea legible, y pulsa `S` para guardar ese fotograma como PNG.

## ¿Y el GPS?

Tripframe dibuja actualmente rutas GPS para archivos al estilo Viofo (Novatek) y de BlackVue. Las grabaciones de Thinkware se reproducen completas, pero sin el mapa. Para ver el GPS de Thinkware en un mapa, el visor oficial sigue siendo el camino.

Mira también: [el modo aparcamiento de la dashcam explicado](/blog/dashcam-parking-mode-explained/) y las [mejores dashcams de gama alta](/blog/best-high-end-dashcams/).
