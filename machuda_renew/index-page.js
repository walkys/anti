/**
 * MACHUDA — index-page.js
 * 리뉴얼 피그마 레이아웃 동적 바인딩 및 인터랙션
 * (카페24 스마트디자인 연동을 고려해 상단 데이터만 수정하면 모든 메뉴와 배너가 자동으로 바뀝니다.)
 */

// =================================================================
// ⚙️ [카페24 관리자용 설정 데이터] — 텍스트나 링크만 마음껏 고치세요!
// =================================================================
const CONFIG_DATA = {
  // 1. 상단 블랙 띠배너 설정
  topBanner: {
    enabled: true,
    text: "마추다 회원가입하고 3,000포인트 적립하세요!",
    link: "#"
  },

  // 2. 검색창 옆 가격 필터 칩 설정
  priceFilters: ["전체", "~1만원", "~2만원", "~3만원", "~4만원", "~5만원"],

  // 3. GNB 메뉴 및 링크 설정
  gnbMenu: {
    items: [
      { name: "주문서", link: "#" },
      { name: "견적문의", link: "order-form.html" },
      { name: "전체상품", link: "#" },
      { name: "주문제작", link: "#" },
      { name: "찜질/마사지/병원", link: "#" },
      { name: "행사", link: "#" },
      { name: "근무복", link: "#" },
      { name: "선거복", link: "#" },
      { name: "학교", link: "#" },
      { name: "스포츠", link: "#" }
    ],
    quickLinks: [
      { name: "주문가이드", emoji: "📝", link: "#" },
      { name: "납품사례", emoji: "🌍", link: "#" },
      { name: "서류요청", emoji: "📄", link: "#" }
    ]
  },

  // 4. 메인 프로모션 카드 슬라이더 설정 (Bento Cards)
  promoCards: [
    {
      title: "급건 전문 & 빠른 제작",
      sub: "*급건의 경우 상담 진행 해주세요",
      btnText: "문의하기",
      link: "order-form.html",
      theme: "black" // 블랙 테마
    },
    {
      title: "100장이상 나염 소형 무료",
      sub: "",
      btnText: "",
      link: "#",
      theme: "blue-outline" // 블루 테두리 테마
    },
    {
      title: "찜질복",
      sub: "",
      btnText: "",
      link: "#",
      theme: "gray" // 연한 그레이 테마
    },
    {
      title: "준비 중인 상품",
      sub: "",
      btnText: "",
      link: "#",
      theme: "gray-empty" // 비어있는 대기 카드 테마
    }
  ],

  // 5. 동그라미 상품 카테고리 8개 설정 (3D 입체 그라데이션)
  roundCategories: [
    { name: "후드/맨투맨", emoji: "🧥", link: "#", gradient: "linear-gradient(135deg, #a78bfa, #c084fc)" },
    { name: "반팔티", emoji: "👕", link: "#", gradient: "linear-gradient(135deg, #60a5fa, #3b82f6)" },
    { name: "키즈", emoji: "🦖", link: "#", gradient: "linear-gradient(135deg, #34d399, #10b981)" },
    { name: "빅사이즈", emoji: "🦍", link: "#", gradient: "linear-gradient(135deg, #475569, #334155)" },
    { name: "스태프", emoji: "🛡️", link: "#", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
    { name: "유니폼", emoji: "⚽", link: "#", gradient: "linear-gradient(135deg, #fb7185, #f43f5e)" },
    { name: "초등학교 반티", emoji: "🎒", link: "#", gradient: "linear-gradient(135deg, #2dd4bf, #0d9488)" },
    { name: "가족티", emoji: "👨‍👩‍👧", link: "#", gradient: "linear-gradient(135deg, #fb923c, #f97316)" }
  ]
};

// =================================================================
// 🚀 [HTML 동적 바인딩 및 렌더링 구동 엔진]
// =================================================================
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initTopBanner();
    initPriceFilters();
    initGnbMenu();
    initPromoSlider();
    initCircleCategories();
    setupPromoSliderScroll();
    setupGlobalInteractions();
  });

  // 1. 탑 블랙 배너 렌더링
  function initTopBanner() {
    const holder = document.getElementById('top-banner-holder');
    if (!holder || !CONFIG_DATA.topBanner.enabled) return;

    holder.innerHTML = `
      <div class="top-banner-bar">
        <a href="${CONFIG_DATA.topBanner.link}" class="top-banner-text">${CONFIG_DATA.topBanner.text}</a>
        <button class="top-banner-close" aria-label="닫기">✕</button>
      </div>
    `;

    // 닫기 버튼 이벤트
    holder.querySelector('.top-banner-close').addEventListener('click', () => {
      holder.style.display = 'none';
    });
  }

  // 2. 가격 필터 칩 렌더링
  function initPriceFilters() {
    const holder = document.getElementById('price-chips-holder');
    if (!holder) return;

    holder.innerHTML = CONFIG_DATA.priceFilters.map((filter, index) => `
      <button class="price-chip ${index === 0 ? 'active' : ''}" data-filter="${filter}">${filter}</button>
    `).join('');

    // 이벤트 바인딩
    holder.querySelectorAll('.price-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        holder.querySelectorAll('.price-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // 3. GNB 메뉴 렌더링
  function initGnbMenu() {
    const menuHolder = document.getElementById('gnb-menu-holder');
    const quickHolder = document.getElementById('gnb-quick-holder');

    if (menuHolder) {
      menuHolder.innerHTML = CONFIG_DATA.gnbMenu.items.map(item => `
        <a href="${item.link}" class="gnb-new-link">${item.name}</a>
      `).join('');
    }

    if (quickHolder) {
      quickHolder.innerHTML = CONFIG_DATA.gnbMenu.quickLinks.map(link => `
        <a href="${link.link}" class="gnb-quick-item">
          <span class="quick-emoji">${link.emoji}</span> ${link.name}
        </a>
      `).join('');
    }
  }

  // 4. 메인 프로모션 카드 슬라이더 렌더링
  function initPromoSlider() {
    const track = document.getElementById('promo-carousel-track');
    if (!track) return;

    track.innerHTML = CONFIG_DATA.promoCards.map(card => {
      let cardContent = '';
      if (card.theme === 'black') {
        cardContent = `
          <div class="promo-card-content">
            <h3 class="promo-card-title">${card.title}</h3>
            <p class="promo-card-sub">${card.sub}</p>
            <a href="${card.link}" class="promo-card-btn">${card.btnText}</a>
          </div>
        `;
      } else if (card.theme === 'blue-outline') {
        cardContent = `
          <div class="promo-card-content">
            <h3 class="promo-card-title text-blue">${card.title}</h3>
          </div>
        `;
      } else {
        cardContent = `
          <div class="promo-card-content">
            <h3 class="promo-card-title">${card.title}</h3>
          </div>
        `;
      }

      return `
        <a href="${card.link}" class="promo-carousel-card card-theme-${card.theme}">
          ${cardContent}
        </a>
      `;
    }).join('');
  }

  // 5. 동그라미 상품 카테고리 렌더링
  function initCircleCategories() {
    const holder = document.getElementById('circle-categories-holder');
    if (!holder) return;

    holder.innerHTML = CONFIG_DATA.roundCategories.map(cat => `
      <a href="${cat.link}" class="circle-cat-item">
        <div class="circle-cat-icon-frame" style="background: ${cat.gradient};">
          <span class="circle-cat-emoji">${cat.emoji}</span>
        </div>
        <span class="circle-cat-name">${cat.name}</span>
      </a>
    `).join('');
  }

  // 6. 메인 프로모션 카드 슬라이더 가로 스크롤 제어
  function setupPromoSliderScroll() {
    const trackWrapper = document.querySelector('.promo-carousel-track-wrapper');
    const prevBtn = document.getElementById('promo-prev-btn');
    const nextBtn = document.getElementById('promo-next-btn');

    if (!trackWrapper || !prevBtn || !nextBtn) return;

    const scrollAmount = 360; // 카드 너비 + 마진 크기만큼 스크롤

    prevBtn.addEventListener('click', () => {
      trackWrapper.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    nextBtn.addEventListener('click', () => {
      trackWrapper.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });
  }

  // FAQ 등 글로벌 인터랙션 재설정
  function setupGlobalInteractions() {
    // FAQ 아코디언 바인딩
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      question && question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(fi => {
          fi.classList.remove('open');
          const fa = fi.querySelector('.faq-answer');
          if (fa) fa.classList.remove('open');
        });
        if (!isOpen) {
          item.classList.add('open');
          if (answer) answer.classList.add('open');
        }
      });
    });

    // 스크롤 시 페이드인 애니메이션
    const fadeTargets = document.querySelectorAll(
      '.case-card, .review-card, .faq-item, .trust-item'
    );
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeTargets.forEach(el => {
      el.classList.add('fade-in-up');
      fadeObserver.observe(el);
    });
  }
})();
