---
title: "Como ver as gravações da dashcam Viofo no computador"
description: "O app da Viofo foi feito para o celular. Veja como assistir às gravações da A119, A129, A139, A229 e A329 no PC ou no Mac, com dianteira e traseira sincronizadas e a rota de GPS em um mapa."
date: 2026-10-29
---

A Viofo faz algumas das dashcams mais populares do mercado: a A119 Mini 2, a A229 Plus e a A229 Pro, a A139 Pro de três canais e a topo de linha A329. O hardware é excelente. Assistir ao que ele gravou no computador é onde a maioria dos donos trava.

## O que a Viofo oferece

O **app VIOFO** para Android e iOS se conecta à câmera por Wi-Fi. Serve para pegar um clipe no acostamento, mas baixar um trajeto inteiro por Wi-Fi é lento, e a tela do celular não é onde você quer estudar um quase acidente quadro a quadro.

No computador não existe um player oficial completo. A maioria dos donos acaba no Explorador de Arquivos ou no Finder, dando clique duplo nos arquivos um de cada vez.

## Como a Viofo nomeia os arquivos

As câmeras Viofo usam o esquema de nomes da Novatek:

`2024_0315_143022_000123F.MP4`

- `2024_0315` é a data (15 de março de 2024)
- `143022` é o horário (14:30:22)
- `000123` é um número sequencial
- `F`, `R` ou `I` indica a câmera: dianteira, traseira ou interna
- Um `P` ou `E` antes da letra da câmera marca um clipe de estacionamento ou de evento

Os clipes de evento bloqueados vão para uma pasta `RO` (somente leitura), e as fotos para `Photo`.

## Assistindo às gravações da Viofo com o Tripframe

O [Tripframe](/) é um visualizador gratuito que roda no navegador e foi construído justamente em torno desses nomes de arquivo.

1. Retire o cartão microSD da câmera e coloque-o no computador (ou use um leitor de cartão USB).
2. Abra [tripframe.vercel.app/app](/app/) no Chrome ou no Edge.
3. Escolha o cartão, ou a pasta `DCIM` dele.

Cada clipe é organizado por dia e horário. Os arquivos dianteiro, traseiro e interno gravados no mesmo momento são pareados em um único bloco, e você os reproduz juntos em vez de procurar o arquivo traseiro correspondente. Os eventos e os clipes de estacionamento ganham uma etiqueta e um filtro próprios.

### Rota de GPS e velocidade

Se a sua Viofo tem GPS (embutido no suporte da maioria dos modelos atuais), a posição fica guardada dentro de cada vídeo. O Tripframe a lê e desenha a rota em um mapa ao lado do vídeo, com a velocidade a cada instante. Pressione `G` para mostrar ou ocultar o mapa.

### Quadro a quadro

Pause e use as teclas de vírgula e ponto para avançar um quadro de cada vez. Pressione `S` para salvar o quadro exato como PNG, com o nome da data e do horário em que foi gravado. Em geral, é o quadro que você quer para uma placa de veículo.

## A229 Pro e HEVC

A A229 Pro e a A329 podem gravar em H.265 (HEVC) para economizar espaço. Nem todo navegador reproduz HEVC de fábrica. O Edge reproduz na maioria dos PCs com Windows, o Safari no Mac também, e o Chrome no Windows precisa da Extensão de Vídeo HEVC gratuita da Microsoft Store. Veja [como reproduzir vídeo H.265 de dashcam](/blog/play-h265-hevc-dashcam-video/) se os seus clipes ficarem pretos. Mudar a câmera para H.264 também resolve, ao custo de arquivos maiores.

## Nada é enviado

O Tripframe lê o cartão no seu próprio computador. Suas gravações nunca são enviadas a lugar nenhum, o que importa quando o clipe mostra rostos e placas de outras pessoas.

Procurando uma Viofo nova? Veja nosso [guia de dashcams intermediárias](/blog/best-mid-range-dashcams/) e os [melhores cartões SD para dashcam](/blog/best-sd-cards-for-dashcams/).
