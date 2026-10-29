---
title: "Cómo ver las grabaciones de una dashcam Viofo en tu ordenador"
description: "La app de Viofo está hecha para el móvil. Así puedes ver en un PC o Mac las grabaciones de las A119, A129, A139, A229 y A329, con delantera y trasera sincronizadas y la ruta GPS en un mapa."
date: 2026-10-29
---

Viofo fabrica algunas de las dashcams más populares: la A119 Mini 2, la A229 Plus y la A229 Pro, la A139 Pro de tres canales y la insignia A329. El hardware es excelente. Ver en un ordenador lo que ha grabado es donde se atascan la mayoría de los propietarios.

## Qué te ofrece Viofo

La **app de VIOFO** para Android e iOS se conecta a la cámara por Wi-Fi. Va bien para sacar un clip suelto en el arcén, pero descargar un trayecto entero por Wi-Fi es lento, y la pantalla de un móvil no es donde quieres estudiar un casi accidente fotograma a fotograma.

En un ordenador no hay un reproductor oficial todo en uno. La mayoría de los propietarios acaban en el Explorador de archivos o el Finder, haciendo doble clic en los archivos uno a uno.

## Cómo nombra Viofo sus archivos

Las cámaras Viofo usan el esquema de nombres de Novatek:

`2024_0315_143022_000123F.MP4`

- `2024_0315` es la fecha (15 de marzo de 2024)
- `143022` es la hora (14:30:22)
- `000123` es un número correlativo
- `F`, `R` o `I` indica la cámara: delantera, trasera o interior
- Una `P` o una `E` antes de la letra de la cámara marca un clip de aparcamiento o de evento

Los clips de evento bloqueados van a una carpeta `RO` (solo lectura) aparte, y las fotos a `Photo`.

## Ver las grabaciones de Viofo con Tripframe

[Tripframe](/) es un visor gratuito que funciona en tu navegador y se creó en torno a estos nombres de archivo.

1. Saca la tarjeta microSD de la cámara y ponla en tu ordenador (o usa un lector de tarjetas USB).
2. Abre [tripframe.vercel.app/app](/app/) en Chrome o Edge.
3. Elige la tarjeta, o la carpeta `DCIM` que contiene.

Cada clip se ordena por día y hora. Los archivos delantero, trasero e interior grabados en el mismo momento se emparejan en una sola ficha, así que los reproduces juntos en lugar de buscar el archivo trasero que corresponde. Los clips de evento y de aparcamiento tienen su propia etiqueta y filtro.

### Ruta GPS y velocidad

Si tu Viofo tiene GPS (integrado en el soporte en la mayoría de los modelos actuales), la posición se guarda dentro de cada vídeo. Tripframe la lee y dibuja la ruta en un mapa junto al vídeo, con la velocidad en cada momento. Pulsa `G` para mostrar u ocultar el mapa.

### Fotograma a fotograma

Pausa y usa las teclas de coma y punto para avanzar un fotograma cada vez. Pulsa `S` para guardar el fotograma exacto como PNG, con el nombre de la fecha y la hora en que se grabó. Suele ser el fotograma que quieres para una matrícula.

## A229 Pro y HEVC

La A229 Pro y la A329 pueden grabar en H.265 (HEVC) para ahorrar espacio. No todos los navegadores reproducen HEVC de serie. Edge lo reproduce en la mayoría de los PC con Windows, Safari en un Mac lo reproduce, y Chrome en Windows necesita la extensión gratuita HEVC Video Extension de la Microsoft Store. Consulta [cómo reproducir vídeo de dashcam en H.265](/blog/play-h265-hevc-dashcam-video/) si tus clips se quedan en negro. Cambiar la cámara a H.264 también lo soluciona, a costa de archivos más grandes.

## No se sube nada

Tripframe lee la tarjeta en tu propio ordenador. Tus grabaciones no se envían a ningún sitio, lo que importa cuando el clip muestra las caras y las matrículas de otras personas.

¿Buscas una Viofo nueva? Consulta nuestra [guía de dashcams de gama media](/blog/best-mid-range-dashcams/) y [las mejores tarjetas SD para dashcam](/blog/best-sd-cards-for-dashcams/).
