# 🎫서울 교육 공공서비스 예약

서울의 교육 공공 서비스 예약을 위한 반응형 웹 애플리케이션입니다.

<img src="https://github.com/user-attachments/assets/92969ea8-4523-4bd4-b306-dd5adab4ace8" width="40%" /> 
<img src="https://github.com/user-attachments/assets/bf4c2dde-7dcc-4a55-aead-5a18cd103c5d" width="40%" />

### 목차

- [프로젝트 개요](#프로젝트-개요)
- [기능](#기능)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [설정](#설정)
- [개선할 점](#개선할-점)

---

### 📖프로젝트 개요

서울 교육 공공 서비스 예약 프로젝트는 서울의 공공 서비스 예약을 지원하는 `Vanilla JS` 반응형 웹 애플리케이션입니다.

### ✨기능

- **서울시 교육 공공서비스예약 정보**: `서울시 교육 공공서비스예약 정보 API`를 사용하여 현재 [공공 서비스 예약](http://yeyak.seoul.go.kr)에 있는 예약 정보를 사용자에게 제공합니다.
- **동적 지도 통합**: `Kakao Maps API`를 사용하여 지도와 마커, 오버레이를 통해 지도 정보를 제공합니다.
- **반응형 디자인**: 다양한 장치에서 호환성을 보장합니다.

### 🛠️설치 방법

프로젝트를 시작하려면 다음 단계를 따르세요:

1. **레포지토리 클론**

   ```bash
   git clone https://github.com/he2e2/seoul-public-service-reservation.git
   ```

2. **프로젝트 디렉토리로 이동**

   ```bash
   cd seoul-public-service-reservation
   ```

3. **의존성 설치**

   ```bash
   npm install
   ```

4. **환경 변수 설정**

   - [서울 열린데이터 광장](https://data.seoul.go.kr/dataList/OA-2268/S/1/datasetView.do)과 [kakao developers](https://developers.kakao.com/)에서 `API_KEY`를 발급 받습니다.
   - `kakao developers` 웹 사이트 도메인을 `http://localhost:3000`으로 등록합니다.
   - 프로젝트 `root` 디렉토리에 `.env` 파일을 생성하고 환경 변수를 추가합니다.

   ```plaintext
   VITE_API_KEY=your-api-key // 서울시 교육 공공서비스예약 정보 API KEY
   VITE_KAKAO_API_KEY=your-kakao-api-key // Kakao Maps API KEY
   ```

### 🚀사용 방법

```bash
npm run dev
```

명령어를 입력하면 Vite 개발 서버를 포트 `3000`에서 실행합니다. `http://localhost:3000`으로 이동하면 애플리케이션을 확인할 수 있습니다.

### ⚙️설정

프로젝트 설정은 vite.config.js 파일에 명시되어 있습니다:

- root: 프로젝트의 루트 디렉토리("./")를 설정합니다.
- build.outDir: 빌드 결과물을 저장할 디렉토리("../dist")를 설정합니다.
- server.port: 개발 서버가 사용할 포트(3000)를 설정합니다.

### 🔥개선할 점

- **활성화된 검색 요소 태그**: 카테고리나 검색어 중 활성화된 요소를 태그 형식으로 화면에 추가해 좀 더 직관적인 UI/UX를 구현하고자 합니다.
