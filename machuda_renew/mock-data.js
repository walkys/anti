const PRODUCTS = [
  {
    id: 'varsity',
    name: '프리미엄 클래식 야구점퍼 (과잠)',
    basePrice: 45000,
    image: 'assets/varsity.jpg',
    description: '고밀도 멜톤 울 바디와 프리미엄 소가죽 레더 슬리브를 사용한 고품질 디자인 자켓입니다. 탄탄한 시보리와 고급 자수 디테일이 돋보입니다.'
  },
  {
    id: 'hoodie',
    name: '헤비웨이트 테리 오버핏 후드',
    basePrice: 25000,
    image: 'assets/hoodie.jpg',
    description: '100% 코튼 800g/야드 헤비웨이트 원단으로 제작되어 탄탄한 핏과 편안한 착용감을 제공합니다. 졸나염 및 전사 인쇄에 최적화되어 있습니다.'
  },
  {
    id: 'tshirt',
    name: '20수 코튼 라운드 반팔티',
    basePrice: 9000,
    image: 'assets/tshirt.jpg',
    description: '코마사 20수 싱글 원단으로 비침이 적고 부드러운 촉감을 자랑합니다. 동아리티, 행사용 단체티로 가장 인기가 많은 스테디셀러입니다.'
  }
];

const INITIAL_PROOFS = [
  {
    id: 'proof-101',
    title: '서울대학교 컴퓨터공학과 26학번 과잠 시안',
    date: '2026-06-25',
    clientName: '김민준 대표',
    productType: '프리미엄 클래식 야구점퍼',
    status: 'pending', // pending, approved, revision
    image: 'assets/varsity.jpg',
    comments: [
      {
        id: 'c1',
        author: '마추다 디자이너',
        role: 'designer',
        content: '신청해주신 로고 시안 반영 완료했습니다. 뒷면 자수 디테일의 골드 메탈릭 실 두께를 확인해 주세요.',
        date: '2026-06-25 14:30'
      },
      {
        id: 'c2',
        author: '김민준 대표',
        role: 'client',
        content: '디자인 너무 이쁩니다! 혹시 왼팔 소매의 학번 "26" 폰트 크기를 아주 살짝만 더 키울 수 있을까요?',
        date: '2026-06-25 16:15'
      },
      {
        id: 'c3',
        author: '마추다 디자이너',
        role: 'designer',
        content: '네, 소매 학번 크기 120% 확대하여 2차 시안 업데이트 및 대기 중입니다.',
        date: '2026-06-26 10:00'
      }
    ]
  },
  {
    id: 'proof-102',
    title: '네이버 웹툰 개발기획팀 워크샵 후드티 시안',
    date: '2026-06-24',
    clientName: '이서연 님',
    productType: '헤비웨이트 테리 오버핏 후드',
    status: 'approved',
    image: 'assets/hoodie.jpg',
    comments: [
      {
        id: 'c1',
        author: '마추다 디자이너',
        role: 'designer',
        content: '전면 로고 화이트 단색 실크스크린 나염 인쇄 시안입니다.',
        date: '2026-06-24 11:00'
      },
      {
        id: 'c2',
        author: '이서연 님',
        role: 'client',
        content: '네, 디자인 깔끔하고 마음에 듭니다. 이대로 인쇄 진행해 주세요!',
        date: '2026-06-24 13:40'
      }
    ]
  },
  {
    id: 'proof-103',
    title: '동아리 AURA 락밴드 연합 정기공연 단체티',
    date: '2026-06-23',
    clientName: '박하준 회장',
    productType: '20수 코튼 라운드 반팔티',
    status: 'revision',
    image: 'assets/tshirt.jpg',
    comments: [
      {
        id: 'c1',
        author: '마추다 디자이너',
        role: 'designer',
        content: '공연 포스터 그래픽을 티셔츠 전면에 디지털 전사 인쇄로 구현한 1차 시안입니다.',
        date: '2026-06-23 09:30'
      },
      {
        id: 'c2',
        author: '박하준 회장',
        role: 'client',
        content: '아, 생각보다 전면 그래픽 크기가 너무 큽니다. 가로 폭 기준 25cm 정도로 줄여주시고 위치를 가슴 위쪽으로 조금 올려주세요.',
        date: '2026-06-23 15:20'
      }
    ]
  }
];

// Browser compatibility export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, INITIAL_PROOFS };
}
