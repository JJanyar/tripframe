---
title: "Como ver as gravações da dashcam BlackVue sem o BlackVue Viewer"
description: "Assista às gravações da BlackVue DR970X, DR770X e DR900X em qualquer computador, com clipes normais, de evento e de estacionamento organizados e dianteira e traseira sincronizadas. Sem instalar nada."
date: 2026-10-29
---

As câmeras BlackVue são conhecidas pelo design limpo, pelo modo de estacionamento forte e pelos recursos de nuvem. Para assistir às gravações no computador, a BlackVue oferece um programa próprio, o **BlackVue Viewer**, para Windows e macOS. Ele funciona, mas é mais um programa para instalar e manter atualizado, e muita gente só quer rever os trajetos da semana passada.

## Como a BlackVue nomeia os arquivos

`20240315_143022_NF.mp4`

- `20240315` é a data
- `143022` é o horário
- A primeira letra depois do horário é o tipo de gravação: `N` normal, `E` evento, `P` estacionamento, `M` manual, além de algumas outras para impacto e movimento no modo de estacionamento
- A segunda letra é a câmera: `F` dianteira, `R` traseira, `I` interna

Os clipes ficam em uma única pasta `Record`, então um cartão cheio é uma lista longa de nomes quase idênticos.

## Assistindo às gravações da BlackVue no navegador

O [Tripframe](/) entende os nomes da BlackVue de fábrica.

1. Coloque o cartão microSD no computador.
2. Abra [o app](/app/) no Chrome ou no Edge.
3. Escolha o cartão ou a pasta `Record`.

Os clipes são agrupados por dia. As gravações normais, de evento e de estacionamento recebem cada uma uma etiqueta, para você filtrar só os eventos e ver na hora o que acionou o sensor G. Os arquivos dianteiro e traseiro do mesmo momento são reproduzidos lado a lado ou em imagem na imagem. Dê um clique duplo na visualização pequena, ou pressione `W`, para trocá-los.

### GPS

A BlackVue grava o registro de GPS como dados NMEA dentro do arquivo. O Tripframe lê esses dados e mostra a rota e a velocidade em um mapa ao lado do vídeo.

## Quando o BlackVue Viewer ainda é a ferramenta certa

O BlackVue Viewer pode alterar as configurações da câmera, e o app da BlackVue cuida de recursos de nuvem, como a visualização remota ao vivo. O Tripframe não faz nenhuma das duas coisas: ele é um player. Para rever o que aconteceu, é mais rápido e roda em qualquer computador sem instalar nada.

## Mantenha seus clipes privados

Quem tem uma BlackVue costuma usar a nuvem. Se você prefere manter certos clipes fora de qualquer servidor, o Tripframe é uma boa opção: os arquivos são lidos no seu próprio computador e nunca são enviados.

Está comparando modelos? Veja as [melhores dashcams premium](/blog/best-high-end-dashcams/) e as [melhores dashcams multicanal](/blog/best-multi-channel-dashcams/).
