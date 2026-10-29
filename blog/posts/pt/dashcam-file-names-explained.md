---
title: "Nomes de arquivo de dashcam explicados, marca por marca"
description: "O que significam nomes como 2024_0315_143022_000123F.MP4 ou REC_2024_03_15_14_30_22_F.MP4? Um guia dos códigos de data, horário, câmera e evento nos nomes de arquivo de dashcam."
date: 2026-10-29
---

Os nomes de arquivo de dashcam parecem ruído, mas quase todos contêm as mesmas quatro informações: a **data**, o **horário**, a **câmera** e, muitas vezes, o **tipo de gravação**. Quando você sabe onde olhar, consegue encontrar qualquer momento.

## Os códigos, marca por marca

| Marca | Exemplo | Data | Horário | Câmera | Tipo |
|---|---|---|---|---|---|
| Viofo (Novatek) | `2024_0315_143022_000123F.MP4` | `2024_0315` | `143022` | `F` `R` `I` | `P` estacionamento, `E` evento, antes da letra da câmera |
| BlackVue | `20240315_143022_NF.mp4` | `20240315` | `143022` | segunda letra `F` `R` `I` | primeira letra `N` normal, `E` evento, `P` estacionamento, `M` manual |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` | `2024_03_15` | `14_30_22` | `F` `R` | prefixo `REC`, `EVT`, `MAN`, `MOT` |
| 70mai | `NO20240315-143022-000123F.mp4` | `20240315` | `143022` | `F` `R` | prefixo `NO` normal, `EV` evento, `PA` estacionamento |
| Nextbase | `240315_143022_001_FH.MP4` | `240315` (ano com dois dígitos) | `143022` | `F` `R` | clipes protegidos em uma pasta própria |
| Tesla | `2024-03-15_14-28-10-front.mp4` | `2024-03-15` | `14-28-10` | `front`, `back`, `left_repeater`… | pasta: `SavedClips`, `SentryClips` |
| Garmin | `GRMN0045.MP4` | nenhuma | nenhum | por câmera | por pasta |

## Pegadinhas comuns

- **O horário é o do início do clipe**, normalmente no fuso horário configurado na câmera. Se o relógio nunca foi acertado, ou se a câmera não ajusta o horário de verão, a hora pode estar errada em uma hora. Confira com algo que você saiba.
- **Os clipes têm de 1 a 3 minutos.** O momento que você procura costuma estar perto do fim de um clipe e do começo do seguinte.
- **Dianteira e traseira são arquivos separados**, com o mesmo horário e uma letra de câmera diferente.
- **As pastas de eventos**, como `RO`, `Event`, `evt_rec` ou `Protected`, guardam clipes que a câmera bloqueou após uma batida. Eles não são sobrescritos.

## Deixe o software ler por você

O [Tripframe](/app/) lê todos esses esquemas e mostra cada clipe com uma data e um horário legíveis, com as câmeras do mesmo momento pareadas. Nomes sem data, como os da Garmin, são ordenados pelo horário em que o arquivo foi gravado.

Você pode ver a decodificação ao vivo na [página inicial do Tripframe](/#moment).
