---
title: "PC와 Mac에서 Thinkware 블랙박스 영상 보는 방법"
description: "Thinkware는 cont_rec, evt_rec, parking_rec 같은 폴더로 영상을 나눠 저장합니다. 브라우저에서 모든 영상을 하나의 타임라인에, 전방과 후방을 함께 보는 방법을 알려 드려요."
date: 2026-10-29
---

U3000, Q1000, F70 Pro 같은 Thinkware 블랙박스는 레이더 기반 주차 모드와 안정적인 화질로 인기가 많습니다. Thinkware는 Windows와 Mac용 **Thinkware Dashcam Viewer**와 휴대폰 앱을 제공해요. 소프트웨어를 설치하고 싶지 않거나 내 컴퓨터가 아니라면 더 빠른 방법이 있습니다.

## Thinkware의 영상 저장 방식

Thinkware 카드는 녹화 유형별 폴더로 나뉘어 있습니다.

- `cont_rec`: 연속 주행 녹화
- `evt_rec`: G센서가 감지한 사고
- `manual_rec`: 버튼으로 저장한 클립
- `parking_rec`와 `motion_timelapse_rec`: 주차 모드

파일 이름은 다음과 같습니다.

`REC_2024_03_15_14_30_22_F.MP4`

접두사(`REC`, `EVT`, `MAN`, `MOT` 등)는 유형이고, 그다음이 날짜와 시간, 그리고 전방 또는 후방을 뜻하는 `F` 또는 `R`입니다.

폴더가 하나의 드라이브를 여러 목록으로 나누기 때문에 어떤 일이 어떤 순서로 일어났는지 보기 어렵습니다. 이벤트 클립은 한 폴더에 있고, 그 직전 몇 분은 다른 폴더에 있어요.

## Tripframe으로 하나의 타임라인 만들기

[Tripframe](/)은 Thinkware의 이름과 폴더를 읽어 모든 클립을 하루 단위의 하나의 타임라인에 다시 배치합니다.

1. microSD 카드를 컴퓨터에 넣으세요.
2. Chrome 또는 Edge에서 [앱](/app/)을 여세요.
3. 카드를 선택하세요.

이벤트, 수동, 주차 클립은 라벨이 유지되어 필터링할 수 있지만, 원래 있어야 할 자리인 일반 클립 사이에 놓입니다. 전방과 후방이 함께 재생되며, `1`, `2`, `3`을 눌러 나란히 보기, 화면 속 화면, 카메라 하나 보기 사이를 전환할 수 있어요.

## 번호판 확인을 위한 프레임 이동

Thinkware의 4K 전방 카메라는 많은 디테일을 담지만, 모션 블러 때문에 선명한 프레임은 한두 개뿐입니다. 일시 정지한 뒤 쉼표와 마침표 키로 번호판이 읽힐 때까지 이동하고, `S`를 눌러 그 프레임을 PNG로 저장하세요.

## GPS는 어떤가요?

Tripframe은 현재 Viofo 방식(Novatek)과 BlackVue 파일의 GPS 경로를 그립니다. Thinkware 영상은 전체가 재생되지만 지도는 표시되지 않아요. Thinkware의 GPS를 지도에서 보려면 공식 뷰어를 사용하는 것이 좋습니다.

함께 보기: [블랙박스 주차 모드 설명](/blog/dashcam-parking-mode-explained/), [하이엔드 블랙박스 추천](/blog/best-high-end-dashcams/).
