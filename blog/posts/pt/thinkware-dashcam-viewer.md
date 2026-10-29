---
title: "Como ver as gravações da dashcam Thinkware no PC e no Mac"
description: "A Thinkware divide as gravações em pastas como cont_rec, evt_rec e parking_rec. Veja como enxergar tudo em uma única linha do tempo, com dianteira e traseira juntas, no navegador."
date: 2026-10-29
---

As dashcams Thinkware, como a U3000, a Q1000 e a F70 Pro, são populares pelo modo de estacionamento assistido por radar e pela boa qualidade de imagem. A Thinkware oferece o **Thinkware Dashcam Viewer** para Windows e Mac e um app de celular. Se você prefere não instalar software, ou está em um computador que não é seu, há um caminho mais rápido.

## Como a Thinkware guarda as gravações

Um cartão da Thinkware é dividido em pastas por tipo de gravação:

- `cont_rec` para a direção contínua
- `evt_rec` para incidentes detectados pelo sensor G
- `manual_rec` para clipes salvos com o botão
- `parking_rec` e `motion_timelapse_rec` para o modo de estacionamento

Os nomes dos arquivos ficam assim:

`REC_2024_03_15_14_30_22_F.MP4`

O prefixo (`REC`, `EVT`, `MAN`, `MOT` e assim por diante) é o tipo, depois vêm a data e o horário e, por fim, `F` ou `R` para dianteira ou traseira.

Como as pastas dividem um trajeto em várias listas, é difícil ver o que aconteceu em ordem. Um clipe de evento fica em uma pasta, e os minutos anteriores em outra.

## Uma única linha do tempo com o Tripframe

O [Tripframe](/) lê os nomes e as pastas da Thinkware e recoloca cada clipe em uma única linha do tempo por dia.

1. Coloque o cartão microSD no computador.
2. Abra [o app](/app/) no Chrome ou no Edge.
3. Escolha o cartão.

Os clipes de evento, manuais e de estacionamento continuam identificados, para você poder filtrá-los, mas ficam entre os clipes normais, no lugar a que pertencem. Dianteira e traseira são reproduzidas juntas; pressione `1`, `2` ou `3` para alternar entre lado a lado, imagem na imagem e uma câmera só.

## Avanço quadro a quadro para placas

As câmeras dianteiras 4K da Thinkware captam bastante detalhe, mas o desfoque de movimento faz com que só um ou dois quadros fiquem nítidos. Pause, depois avance com as teclas de vírgula e ponto até a placa ficar legível, e pressione `S` para salvar esse quadro como PNG.

## E o GPS?

Atualmente, o Tripframe desenha rotas de GPS para arquivos no estilo Viofo (Novatek) e da BlackVue. As gravações da Thinkware são reproduzidas por inteiro, mas sem o mapa. Para ver o GPS da Thinkware em um mapa, o visualizador oficial ainda é o caminho.

Veja também: [modo de estacionamento da dashcam explicado](/blog/dashcam-parking-mode-explained/) e as [melhores dashcams premium](/blog/best-high-end-dashcams/).
