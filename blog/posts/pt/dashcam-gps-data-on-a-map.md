---
title: Como ver os dados de GPS da dashcam num mapa
description: A maioria das dashcams com GPS esconde a posição e a velocidade dentro do arquivo de vídeo. Veja onde ficam guardadas, qual marca usa qual formato e como ver a rota ao lado do vídeo.
date: 2026-10-29
updated: 2026-10-30
---

Uma dashcam com GPS registra onde você estava e a que velocidade andava, a cada segundo. Isso pode pesar muito depois de um incidente: mostra que sua velocidade estava dentro do limite ou exatamente onde algo aconteceu. Mas você não vai achar um arquivo de GPS separado no cartão. Os dados ficam escondidos dentro dos vídeos.

## Onde os dados de GPS ficam guardados

| Marca | Como o GPS é guardado |
|---|---|
| Viofo e outras câmeras baseadas em Novatek | Dentro do arquivo MP4, num bloco muitas vezes chamado de "freeGPS" |
| BlackVue | Sentenças NMEA dentro do arquivo MP4 |
| Thinkware | Dentro do arquivo, no formato próprio da Thinkware |
| Nextbase | Dentro do arquivo, no formato próprio da Nextbase |
| Garmin | Dentro do arquivo, no formato próprio da Garmin |
| GoPro | Uma faixa de telemetria separada (GPMF) no arquivo, com altitude e acelerômetro |
| Tesla | Não é guardado nos arquivos da dashcam |

Um player de vídeo comum ignora totalmente esses dados. Você precisa de um software que saiba onde procurar.

## Veja a rota ao lado do vídeo

O [Tripframe](/app/) lê o GPS de arquivos **Viofo / Novatek**, **BlackVue** e **GoPro**.

1. Abra o cartão no Tripframe.
2. Abra um clipe e aperte `G`, ou clique em **Mapa**.

Um mapa aparece ao lado do vídeo com a rota do clipe. Uma seta acompanha o carro enquanto o vídeo toca, com a velocidade, a direção e a distância abaixo do mapa, em km/h ou mph. Alterne entre as visões de mapa, satélite e híbrida, e colora a rota pela velocidade. Aperte `R` para gravar o vídeo e o mapa juntos num único arquivo.

Abaixo do mapa, gráficos mostram velocidade, distância, direção e, quando a câmera registra, altitude, inclinação, força G e satélites. Clique num gráfico para ir àquele momento. Aperte `T` para pôr um marcador na rota e `H` para mostrar os dados de condução no próprio vídeo.

As imagens do mapa vêm do OpenStreetMap e, nas visões de satélite, da Esri. Clima e endereços só são consultados se você ativar. Seus vídeos e dados de GPS ficam no seu computador.

## Exportando os dados de GPS

Precisa da rota como arquivo? Abaixo do mapa, no Tripframe, escolha **GPX** (para a maioria dos apps de mapas e esportes), **KML** (para o Google Earth), **CSV** (uma planilha com horário, posição, velocidade, direção e altitude de cada ponto) ou **GeoJSON** (para ferramentas de GIS). Para as marcas que o Tripframe ainda não lê, use um programa de desktop como o Dashcam Viewer ou o Registrator Viewer. Veja [os melhores softwares de dashcam](/blog/best-dashcam-software/).

## O GPS não aparece?

- Confira se o GPS está ativado nas configurações da câmera e se o suporte ou módulo de GPS está conectado.
- Nos primeiros minutos depois de ligar, o GPS pode faltar enquanto a câmera encontra os satélites.
- Sua marca pode usar um formato que o Tripframe ainda não lê; o vídeo continua tocando normalmente.
