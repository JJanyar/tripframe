---
title: "Como ver os dados de GPS da dashcam em um mapa"
description: "A maioria das dashcams com GPS esconde a posição e a velocidade dentro do arquivo de vídeo. Veja onde ficam esses dados, qual marca usa qual formato e como ver o trajeto ao lado do vídeo."
date: 2026-10-29
---

Uma dashcam com GPS registra onde você estava e a que velocidade dirigia, a cada segundo. Isso pode pesar muito depois de um incidente: mostra que a sua velocidade estava dentro do limite, ou exatamente onde algo aconteceu. Mas você não vai encontrar um arquivo de GPS separado no cartão. Os dados ficam escondidos dentro dos vídeos.

## Onde os dados de GPS ficam guardados

| Marca | Como o GPS é armazenado |
|---|---|
| Viofo e outras câmeras baseadas em Novatek | Dentro do arquivo MP4, em um bloco muitas vezes chamado de "freeGPS" |
| BlackVue | Sentenças NMEA dentro do arquivo MP4 |
| Thinkware | Dentro do arquivo, em formato próprio da Thinkware |
| Nextbase | Dentro do arquivo, em formato próprio da Nextbase |
| Garmin | Dentro do arquivo, em formato próprio da Garmin |
| Tesla | Não é armazenado nos arquivos da dashcam |

Um player de vídeo comum ignora totalmente esses dados. Você precisa de um software que saiba onde procurar.

## Veja o trajeto ao lado do vídeo

O [Tripframe](/app/) lê o GPS de arquivos **Viofo / Novatek** e **BlackVue**.

1. Abra o cartão no Tripframe.
2. Abra um clipe e pressione `G`, ou clique em **Mapa**.

Um mapa aparece ao lado do vídeo com o trajeto do clipe. Um marcador acompanha o carro enquanto o vídeo é reproduzido, com a velocidade em km/h abaixo do mapa. Pressione `R` para gravar o vídeo e o mapa juntos em um único arquivo.

Os blocos do mapa vêm do OpenStreetMap. É a única coisa que o Tripframe carrega da internet; suas gravações e seus dados de GPS ficam no seu computador.

## Exportando os dados de GPS

Precisa do trajeto como arquivo? Abaixo do mapa no Tripframe, escolha **GPX** (para a maioria dos apps de mapas e esportes), **KML** (para o Google Earth) ou **CSV** (uma planilha com horário, posição, velocidade e direção de cada ponto). Para as marcas que o Tripframe ainda não consegue ler, use um programa de desktop como o Dashcam Viewer ou o Registrator Viewer. Veja [o melhor software para dashcam](/blog/best-dashcam-software/).

## O GPS não aparece?

- Confira se o GPS está ativado nas configurações da câmera e se o suporte ou módulo de GPS está conectado.
- Nos primeiros minutos depois de ligar, pode não haver GPS enquanto a câmera encontra os satélites.
- Sua marca pode usar um formato que o Tripframe ainda não lê; o vídeo continua sendo reproduzido normalmente.
