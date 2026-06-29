/**
 * MACHUDA — index-page.js
 * 리뉴얼 피그마 레이아웃 동적 바인딩 및 인터랙션
 * (카페24 스마트디자인 치환코드 자동 감지 하이브리드 엔진 내장)
 */

// =================================================================
// ⚙️ [로컬 테스트용 모의 데이터] — 카페24 어드민에 배너/카테고리가 없을 때 적용됩니다.
// =================================================================
const CONFIG_DATA = {
  topBanner: {
    enabled: true,
    text: "마추다 회원가입하고 3,000포인트 적립하세요!",
    link: "#"
  },
  priceFilters: ["전체", "~1만원", "~2만원", "~3만원", "~4만원", "~5만원"],
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
  promoCards: [
    {
      title: "급건 전문 & 빠른 제작",
      sub: "*급건의 경우 상담 진행 해주세요",
      btnText: "문의하기",
      link: "order-form.html",
      theme: "black"
    },
    {
      title: "100장이상 나염 소형 무료",
      sub: "",
      btnText: "",
      link: "#",
      theme: "blue-outline"
    },
    {
      title: "찜질복",
      sub: "",
      btnText: "",
      link: "#",
      theme: "gray"
    },
    {
      title: "준비 중인 상품",
      sub: "",
      btnText: "",
      link: "#",
      theme: "gray-empty"
    }
  ],
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
// 🚀 [하이브리드 구동 엔진]
// =================================================================
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. 카페24 치환코드가 정상 파싱되었는지 체크
    const isLocalMode = checkIsLocalMode();

    initTopBanner(isLocalMode);
    initPriceFilters();
    initGnbMenu(isLocalMode);
    initPromoSlider(isLocalMode);
    initCircleCategories(isLocalMode);

    setupPromoSliderScroll();
    setupGlobalInteractions();
  });

  // 카페24 서버 파싱 실패(로컬 파일 열기 상태) 감지 함수
  function checkIsLocalMode() {
    const checkEl = document.getElementById('gnb-menu-holder');
    if (!checkEl) return true;
    // HTML 소스 내에 카페24용 중괄호 변수 {$category_name} 등이 그대로 들어있다면 로컬 모드로 작동시킵니다.
    return checkEl.innerHTML.includes('{$') || checkEl.innerHTML.trim() === '';
  }

  // 1. 탑 블랙 배너 렌더링
  function initTopBanner(isLocalMode) {
    const holder = document.getElementById('top-banner-holder');
    if (!holder) return;

    // 로컬 모드인 경우에만 목업 배너 생성
    if (isLocalMode) {
      holder.innerHTML = `
        <div class="top-banner-bar">
          <a href="${CONFIG_DATA.topBanner.link}" class="top-banner-text">${CONFIG_DATA.topBanner.text}</a>
          <button class="top-banner-close" aria-label="닫기">✕</button>
        </div>
      `;
      holder.querySelector('.top-banner-close').addEventListener('click', () => {
        holder.style.display = 'none';
      });
    } else {
      // 카페24 라이브 환경인 경우, 팝업이 로드된 후 닫기 바인딩
      const closeBtn = holder.querySelector('.top-banner-close') || holder.querySelector('.close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          holder.style.display = 'none';
        });
      }
    }
  }

  // 2. 가격 필터 칩 렌더링 (카페24 무관 로컬 UI)
  function initPriceFilters() {
    const holder = document.getElementById('price-chips-holder');
    if (!holder) return;

    holder.innerHTML = CONFIG_DATA.priceFilters.map((filter, index) => `
      <button class="price-chip ${index === 0 ? 'active' : ''}" data-filter="${filter}">${filter}</button>
    `).join('');

    holder.querySelectorAll('.price-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        holder.querySelectorAll('.price-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log(`[가격 필터]: ${btn.dataset.filter}`);
      });
    });
  }

  // 3. GNB 메뉴 렌더링
  function initGnbMenu(isLocalMode) {
    const menuHolder = document.getElementById('gnb-menu-holder');
    const quickHolder = document.getElementById('gnb-quick-holder');

    // 로컬 환경일 때만 목업 카테고리를 그려줍니다.
    if (isLocalMode && menuHolder) {
      menuHolder.innerHTML = CONFIG_DATA.gnbMenu.items.map(item => `
        <a href="${item.link}" class="gnb-new-link">${item.name}</a>
      `).join('');
    }

    // 퀵 링크 렌더링
    if (quickHolder) {
      quickHolder.innerHTML = CONFIG_DATA.gnbMenu.quickLinks.map(link => `
        <a href="${link.link}" class="gnb-quick-item">
          <span class="quick-emoji">${link.emoji}</span> ${link.name}
        </a>
      `).join('');
    }
  }

  // 4. 메인 프로모션 카드 슬라이더 렌더링
  function initPromoSlider(isLocalMode) {
    const track = document.getElementById('promo-carousel-track');
    if (!track) return;

    // 로컬 환경일 때만 목업 프로모션 카드를 그려줍니다.
    if (isLocalMode) {
      track.innerHTML = CONFIG_DATA.promoCards.map(card => {
        let cardContent = '';
        if (card.theme === 'black') {
          cardContent = `
            <div class="promo-card-content">
              <h3 class="promo-card-title">${card.title}</h3>
              <p class="promo-card-sub">${card.sub}</p>
              <span class="promo-card-btn">${card.btnText}</span>
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
    } else {
      // 카페24 라이브 환경: 어드민 등록된 배너 리스트들에 CSS 클래스와 템플릿 테마 클래스를 순차 적용해 줍니다.
      const cards = track.querySelectorAll('.promo-carousel-card');
      const themes = ['black', 'blue-outline', 'gray', 'gray-empty'];
      
      cards.forEach((card, index) => {
        const theme = themes[index % themes.length];
        card.classList.add(`card-theme-${theme}`);
      });
    }
  }

  // 5. 동그라미 상품 카테고리 렌더링
  function initCircleCategories(isLocalMode) {
    const holder = document.getElementById('circle-categories-holder');
    if (!holder) return;

    // 로컬 환경일 때만 목업 그라데이션 원형 카테고리를 그려줍니다.
    if (isLocalMode) {
      holder.innerHTML = CONFIG_DATA.roundCategories.map(cat => `
        <a href="${cat.link}" class="circle-cat-item">
          <div class="circle-cat-icon-frame" style="background: ${cat.gradient};">
            <span class="circle-cat-emoji">${cat.emoji}</span>
          </div>
          <span class="circle-cat-name">${cat.name}</span>
        </a>
      `).join('');
    } else {
      // 카페24 라이브 환경: 실제 카테고리 루프 엘리먼트들에 입체 그라데이션 배경을 무작위 혹은 순차적으로 입혀줍니다.
      const items = holder.querySelectorAll('.circle-cat-item');
      items.forEach((item, index) => {
        const catData = CONFIG_DATA.roundCategories[index % CONFIG_DATA.roundCategories.length];
        const frame = item.querySelector('.circle-cat-icon-frame');
        if (frame) {
          frame.style.background = catData.gradient;
          // 어드민 등록 이미지가 없으면 텍스트(이모지)로 대체
          const img = frame.querySelector('.circle-cat-img-source');
          const fallback = frame.querySelector('.circle-cat-fallback-emoji');
          if (img && (!img.getAttribute('src') || img.getAttribute('src').includes('{$'))) {
            img.style.display = 'none';
            if (fallback) {
              fallback.textContent = catData.emoji;
              fallback.style.display = 'inline';
            }
          } else if (fallback) {
            fallback.style.display = 'none';
          }
        }
      });
    }
  }

  // 6. 메인 프로모션 카드 슬라이더 가로 스크롤 제어
  function setupPromoSliderScroll() {
    const trackWrapper = document.querySelector('.promo-carousel-track-wrapper');
    const prevBtn = document.getElementById('promo-prev-btn');
    const nextBtn = document.getElementById('promo-next-btn');

    if (!trackWrapper || !prevBtn || !nextBtn) return;

    const scrollAmount = 380; // 카드 너비 + 마진 크기만큼 스크롤

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

    // 8. 카테고리 탭 (Best Select) 로컬 전환 인터랙션
    const tabButtons = document.querySelectorAll('.main_product_tab button');
    const tabContents = document.querySelectorAll('.content_list .tabcontent');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-id');
        tabContents.forEach(content => {
          if (content.id === targetId) {
            content.style.display = 'block';
          } else {
            content.style.display = 'none';
          }
        });
      });
    });
    // 첫번째 탭 활성화
    if (tabButtons.length > 0) {
      tabButtons[0].click();
    }
  }
})();
