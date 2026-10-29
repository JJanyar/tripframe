---
title: "Como reproduzir vídeo de dashcam H.265 (HEVC) no Windows e no Mac"
description: "Tela preta, só som ou \"este arquivo não pode ser reproduzido\"? Sua dashcam provavelmente grava em H.265. Veja como reproduzir no Edge, no Chrome, no Safari e no VLC, ou como evitar o problema."
date: 2026-10-29
---

Muitas dashcams mais novas, como a Viofo A229 Pro e a A329, a 70mai A810 e vários modelos da BlackVue e da Thinkware, podem gravar em **H.265**, também chamado de **HEVC**. Ele reduz o tamanho do arquivo mais ou menos pela metade em relação ao H.264 com a mesma qualidade, então o cartão comporta o dobro de gravações.

O problema: nem todo computador reproduz H.265 de fábrica.

## Sintomas

- O vídeo fica preto, mas o tempo corre ou há som
- Um erro como "este arquivo não pode ser reproduzido" ou "codec não compatível"
- Miniaturas em branco

## A solução, por navegador e sistema

| Onde | Reproduz H.265? | O que fazer |
|---|---|---|
| Edge no Windows | Em geral, sim | Nada, na maioria dos PCs com um chip gráfico recente |
| Chrome no Windows | Com a extensão | Instale as **Extensões de Vídeo HEVC** na Microsoft Store |
| Safari no Mac | Sim | Nada |
| Chrome no Mac | Em geral, sim | Mantenha o Chrome e o macOS atualizados |
| Firefox | Limitado | Use o Edge, o Chrome ou o Safari |
| VLC | Sim | O VLC tem decodificador próprio |

Os navegadores usam o decodificador de vídeo por hardware do seu computador. Um hardware gráfico muito antigo pode não decodificar H.265; nesse caso, o VLC é a alternativa.

## Ou mude a câmera para H.264

Se você assiste às gravações em vários computadores, pode ser mais fácil configurar a câmera para H.264 no menu de configurações ou no app. Os arquivos ficam maiores, então confira o tamanho do cartão: [os melhores cartões SD para dashcam](/blog/best-sd-cards-for-dashcams/).

## No Tripframe

O [Tripframe](/app/) reproduz tudo o que o seu navegador consegue decodificar. Se um clipe mostrar um erro, os passos acima resolvem; recarregue a página depois. Clipes em H.264 sempre são reproduzidos.
