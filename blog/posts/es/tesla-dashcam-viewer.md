---
title: "Cómo ver las grabaciones de TeslaCam y del Sentry Mode en tu ordenador"
description: "El visor del coche de Tesla sirve para echar un vistazo rápido. Para revisar RecentClips, SavedClips y SentryClips en un PC o Mac, con delantera y trasera sincronizadas, usa tu navegador."
date: 2026-10-29
---

Todos los Tesla graban sus cámaras en una unidad USB en la guantera o en la consola central. El coche tiene un visor integrado, pero ir pasando eventos del Sentry Mode sentado en el asiento del conductor no es lo ideal, y la unidad se llena enseguida.

## Cómo guarda TeslaCam las grabaciones

La unidad USB tiene una carpeta `TeslaCam` con tres partes:

- `RecentClips`: la última hora de conducción, sobrescrita de forma continua
- `SavedClips`: clips que guardaste con el botón de la dashcam o tocando el claxon (si está activado)
- `SentryClips`: eventos grabados por el Sentry Mode con el coche aparcado

Cada evento es una carpeta con el nombre de su fecha y hora, que contiene archivos de un minuto por cámara:

`2024-03-15_14-28-10-front.mp4`, `-back.mp4`, `-left_repeater.mp4`, `-right_repeater.mp4`

## Ver las grabaciones de TeslaCam con Tripframe

[Tripframe](/) lee la fecha y la cámara de estos nombres.

1. Conecta la unidad USB del Tesla a tu ordenador.
2. Abre [la app](/app/) en Chrome o Edge.
3. Elige la carpeta `TeslaCam`.

Cada minuto de grabación aparece por día y hora. Los clips guardados se marcan como eventos y los del Sentry Mode como aparcamiento, para que puedas filtrar por lo que buscas. Las cámaras delantera y trasera del mismo minuto se reproducen juntas, lado a lado o en imagen en imagen.

Las cámaras repetidoras laterales también aparecen, como fichas separadas a la misma hora, así que puedes abrirlas justo después de la vista delantera y trasera.

## Recorre el momento paso a paso

Los eventos del Sentry Mode suelen ser unos segundos de alguien que pasa por delante. Pausa, avanza fotograma a fotograma con `,` y `.`, y pulsa `S` para guardar como PNG el fotograma más claro de una cara o una matrícula, con el nombre de la hora exacta.

## Mantenlo en local

Los clips del Sentry Mode muestran tu entrada y a tus vecinos. Tripframe nunca sube nada: los archivos se leen en tu propio ordenador.

## Consejos

- Copia `SavedClips` y `SentryClips` a tu ordenador antes de que se llene la unidad; Tesla borra los clips más antiguos cuando se queda sin espacio.
- Usa una unidad rápida y de alta resistencia; consulta [las mejores tarjetas SD y almacenamiento para dashcam](/blog/best-sd-cards-for-dashcams/).
- ¿Guardas un clip para tu aseguradora? Lee [cómo guardar las grabaciones de la dashcam para el seguro y la policía](/blog/save-dashcam-footage-for-insurance/).
