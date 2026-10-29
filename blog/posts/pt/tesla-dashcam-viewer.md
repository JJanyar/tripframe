---
title: "Como ver as gravações do TeslaCam e do Modo Sentinela no computador"
description: "O visualizador do carro da Tesla serve para uma olhada rápida. Para percorrer RecentClips, SavedClips e SentryClips no PC ou no Mac, com dianteira e traseira sincronizadas, use o navegador."
date: 2026-10-29
---

Todo Tesla grava suas câmeras em um pendrive USB no porta-luvas ou no console central. O carro tem um visualizador integrado, mas ficar sentado no banco do motorista rolando eventos do Modo Sentinela não é o ideal, e o pendrive enche rápido.

## Como o TeslaCam guarda as gravações

O pendrive USB tem uma pasta `TeslaCam` com três partes:

- `RecentClips`: a última hora de direção, sobrescrita continuamente
- `SavedClips`: clipes que você salvou com o botão da dashcam ou buzinando (se ativado)
- `SentryClips`: eventos gravados pelo Modo Sentinela com o carro estacionado

Cada evento é uma pasta nomeada com a data e o horário, contendo arquivos de um minuto por câmera:

`2024-03-15_14-28-10-front.mp4`, `-back.mp4`, `-left_repeater.mp4`, `-right_repeater.mp4`

## Assistindo às gravações do TeslaCam com o Tripframe

O [Tripframe](/) lê a data e a câmera desses nomes.

1. Conecte o pendrive USB do Tesla ao computador.
2. Abra [o app](/app/) no Chrome ou no Edge.
3. Escolha a pasta `TeslaCam`.

Cada minuto de gravação aparece por dia e horário. Os clipes salvos são marcados como eventos e os do Modo Sentinela como estacionamento, para você filtrar pelo que procura. As câmeras dianteira e traseira do mesmo minuto são reproduzidas juntas, lado a lado ou em imagem na imagem.

As câmeras das repetidoras laterais também aparecem, como blocos separados no mesmo horário, então você pode abri-las logo depois da visualização dianteira e traseira.

## Percorra o momento quadro a quadro

Os eventos do Modo Sentinela costumam ser alguns segundos de alguém passando. Pause, avance quadro a quadro com `,` e `.` e pressione `S` para salvar o quadro mais nítido de um rosto ou de uma placa como PNG, com o nome do horário exato.

## Mantenha tudo local

Os clipes do Modo Sentinela mostram a sua garagem e os seus vizinhos. O Tripframe nunca envia nada: os arquivos são lidos no seu próprio computador.

## Dicas

- Copie `SavedClips` e `SentryClips` para o computador antes que o pendrive encha; a Tesla apaga os clipes mais antigos quando fica sem espaço.
- Use um pendrive rápido e de alta resistência; veja [os melhores cartões SD e armazenamento para dashcam](/blog/best-sd-cards-for-dashcams/).
- Vai salvar um clipe para a seguradora? Leia [como salvar gravações de dashcam para a seguradora e a polícia](/blog/save-dashcam-footage-for-insurance/).
