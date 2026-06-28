// ==========================================================================
// Machuda Real-Time Auto-Quote Calculator JavaScript
// Handles product search, custom entry, calculations, and print layout.
// ==========================================================================

const MACHUDA_CALCULATOR_HTML = `
<!-- Calculator Modal Overlay -->
<div class="machuda-modal-overlay" id="machuda-calculator-modal">
    <div class="machuda-modal-container">
        <button type="button" class="btn-close-modal" id="btn-close-modal">&times;</button>
        <div class="machuda-modal-header">
            <h2><i class="xi-calculator"></i> MACHUDA 실시간 자동 견적기</h2>
            <p>원하는 단체복 종류와 수량, 인쇄 옵션을 선택하시면 실시간 예상 견적이 계산됩니다.</p>
        </div>
        <div class="machuda-modal-body">
            <main class="machuda-app-main">
                <div class="machuda-main-container">
                    
                    <!-- Left Side: Configurator -->
                    <section class="machuda-config-panel">
                        <div class="machuda-panel-header">
                            <h2><span class="machuda-step-badge">GOAL</span> 단체복 조건 설정</h2>
                            <p>원하는 의류와 수량, 인쇄 기법을 선택하면 견적이 실시간으로 계산됩니다.</p>
                        </div>
                        
                        <!-- STEP 1: Product Selection -->
                        <div class="machuda-config-section" id="step-product">
                            <div class="machuda-section-title">
                                <span class="machuda-step-num">01</span>
                                <h3>의류 종류 선택</h3>
                                <p class="machuda-section-desc">마추다 쇼핑몰 상품명 또는 키워드를 검색하거나 리스트에서 선택해 주세요.</p>
                            </div>
                            
                            <!-- Search Input Area -->
                            <div class="search-product-area">
                                <div class="search-input-wrap">
                                    <i class="xi-search search-icon"></i>
                                    <input type="text" id="product-search-input" placeholder="원하는 상품명을 검색해 보세요... (예: 반팔, 카라티, 후드, 조끼, 과잠, 맨투맨)" autocomplete="off">
                                </div>
                            </div>
                            
                            <!-- Selected Product Card View -->
                            <div class="selected-product-preview" id="selected-product-preview" style="display: none;">
                                <div class="preview-card">
                                    <div class="preview-image-wrap" id="preview-image-wrap">
                                        <div class="preview-icon"><i class="xi-check-circle"></i></div>
                                    </div>
                                    <div class="preview-details">
                                        <span class="preview-badge" id="preview-category">카테고리</span>
                                        <h4 id="preview-name">선택된 상품명</h4>
                                        <span class="preview-price" id="preview-price">0원 <small>/벌</small></span>
                                    </div>
                                    <button type="button" class="btn-change-product" id="btn-change-product">의류 변경</button>
                                </div>
                            </div>
                            
                            <!-- Search Results / Product List -->
                            <div class="search-results-list" id="search-results-list">
                                <!-- Dynamic search result rows will be injected here by JavaScript -->
                            </div>
                            
                            <!-- Custom Product Input Trigger -->
                            <div class="custom-product-trigger">
                                <span class="or-text">찾으시는 의류가 없으신가요?</span>
                                <button type="button" class="btn-toggle-custom" id="btn-toggle-custom">직접 상품 정보 입력하기</button>
                            </div>

                            <!-- Custom Product Input Form -->
                            <div class="custom-product-form" id="custom-product-form" style="display: none;">
                                <div class="custom-inputs-row">
                                    <div class="input-item">
                                        <label for="custom-name">의류/상품명 직접 입력</label>
                                        <input type="text" id="custom-name" placeholder="예: 길단 20수 특양면 맨투맨">
                                    </div>
                                    <div class="input-item">
                                        <label for="custom-price">기본 단가 (벌당)</label>
                                        <div class="price-input-wrap">
                                            <input type="number" id="custom-price" placeholder="15000" min="0">
                                            <span class="unit">원</span>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn-apply-custom" id="btn-apply-custom">입력 상품 적용</button>
                            </div>
                        </div>

                        <!-- STEP 2: Quantity Selection -->
                        <div class="machuda-config-section" id="step-qty">
                            <div class="machuda-section-title">
                                <span class="machuda-step-num">02</span>
                                <h3>주문 수량 설정</h3>
                            </div>
                            <div class="machuda-quantity-control-area">
                                <div class="machuda-qty-inputs">
                                    <span class="machuda-qty-label">주문 수량</span>
                                    <div class="machuda-qty-numeric-wrap">
                                        <input type="number" id="qty-number" min="1" max="1000" value="30">
                                        <span class="unit-txt">벌</span>
                                    </div>
                                </div>
                                <div class="machuda-range-slider-wrap">
                                    <input type="range" id="qty-slider" min="1" max="500" value="30" step="1">
                                    <div class="machuda-discount-markers">
                                        <span class="machuda-marker active" data-val="1">기본</span>
                                        <span class="machuda-marker" data-val="100">100장 이상 <small>(소형 나염 무료)</small></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- STEP 3: Printing Configuration -->
                        <div class="machuda-config-section" id="step-print">
                            <div class="machuda-section-title">
                                <span class="machuda-step-num">03</span>
                                <h3>인쇄 영역 및 방식 설정</h3>
                                <p class="machuda-section-desc">인쇄를 원하는 옷의 위치를 켜고 방식을 설정해주세요.</p>
                            </div>
                            
                            <div class="machuda-print-zones-list">
                                
                                <!-- Zone 1: Front -->
                                <div class="machuda-print-zone-row" data-zone="front">
                                    <div class="machuda-zone-header">
                                        <label class="machuda-switch-wrap">
                                            <input type="checkbox" id="print-front-toggle" checked>
                                            <span class="machuda-switch-slider"></span>
                                        </label>
                                        <span class="machuda-zone-title"><i class="xi-layout-column"></i> 전면 (앞판) 인쇄</span>
                                        <span class="machuda-zone-badge active" id="badge-front">선택됨</span>
                                    </div>
                                    
                                    <div class="machuda-zone-body active" id="body-front">
                                        <div class="machuda-options-grid">
                                            <div class="machuda-option-group">
                                                <label>인쇄 방식</label>
                                                <select class="print-method" id="method-front">
                                                    <option value="screen" selected>졸나염 (실시간 자동 계산)</option>
                                                    <option value="silk">실크 / 발포 / 금분 / 은분 나염 (실시간 자동 계산)</option>
                                                    <option value="flock">후로피 (실시간 자동 계산)</option>
                                                    <option value="transfer">실사 / 우레탄 (실시간 자동 계산)</option>
                                                    <option value="embroidery">컴퓨터 자수 (견적 별도 문의)</option>
                                                </select>
                                                <div class="print-inquiry-warning" id="warning-front" style="display:none;">
                                                    <i class="xi-warning"></i> 자수/전사 인쇄는 디테일에 따라 가격 변동이 심하여 카카오톡이나 전화로 도안 전달 후 별도 견적을 받아보셔야 합니다.
                                                </div>
                                            </div>
                                            <div class="machuda-option-group sub-option" id="sub-front-screen">
                                                <label>나염 색상 도수</label>
                                                <select class="print-colors" id="colors-front">
                                                    <option value="1" selected>1도 (단색)</option>
                                                    <option value="2">2도 (두 가지 색)</option>
                                                    <option value="3">3도 (세 가지 색)</option>
                                                </select>
                                            </div>
                                            <div class="machuda-option-group">
                                                <label>인쇄 크기</label>
                                                <select class="print-size" id="size-front">
                                                    <option value="small">소형 (10x10cm 이하 가슴로고)</option>
                                                    <option value="large" selected>대형 (A4 크기 등판/중앙)</option>
                                                    <option value="huge">특대형 (A3 크기 풀사이즈)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Zone 2: Back -->
                                <div class="machuda-print-zone-row" data-zone="back">
                                    <div class="machuda-zone-header">
                                        <label class="machuda-switch-wrap">
                                            <input type="checkbox" id="print-back-toggle">
                                            <span class="machuda-switch-slider"></span>
                                        </label>
                                        <span class="machuda-zone-title"><i class="xi-layout-aside"></i> 후면 (등판) 인쇄</span>
                                        <span class="machuda-zone-badge" id="badge-back">미선택</span>
                                    </div>
                                    
                                    <div class="machuda-zone-body" id="body-back">
                                        <div class="machuda-options-grid">
                                            <div class="machuda-option-group">
                                                <label>인쇄 방식</label>
                                                <select class="print-method" id="method-back">
                                                    <option value="screen" selected>졸나염 (실시간 자동 계산)</option>
                                                    <option value="silk">실크 / 발포 / 금분 / 은분 나염 (실시간 자동 계산)</option>
                                                    <option value="flock">후로피 (실시간 자동 계산)</option>
                                                    <option value="transfer">실사 / 우레탄 (실시간 자동 계산)</option>
                                                    <option value="embroidery">컴퓨터 자수 (견적 별도 문의)</option>
                                                </select>
                                                <div class="print-inquiry-warning" id="warning-back" style="display:none;">
                                                    <i class="xi-warning"></i> 자수/전사 인쇄는 디테일에 따라 가격 변동이 심하여 카카오톡이나 전화로 도안 전달 후 별도 견적을 받아보셔야 합니다.
                                                </div>
                                            </div>
                                            <div class="machuda-option-group sub-option" id="sub-back-screen">
                                                <label>나염 색상 도수</label>
                                                <select class="print-colors" id="colors-back">
                                                    <option value="1" selected>1도 (단색)</option>
                                                    <option value="2">2도 (두 가지 색)</option>
                                                    <option value="3">3도 (세 가지 색)</option>
                                                </select>
                                            </div>
                                            <div class="machuda-option-group">
                                                <label>인쇄 크기</label>
                                                <select class="print-size" id="size-back">
                                                    <option value="small">소형 (10x10cm 이하 가슴로고)</option>
                                                    <option value="large" selected>대형 (A4 크기 등판/중앙)</option>
                                                    <option value="huge">특대형 (A3 크기 풀사이즈)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Zone 3: Sleeve -->
                                <div class="machuda-print-zone-row" data-zone="sleeve">
                                    <div class="machuda-zone-header">
                                        <label class="machuda-switch-wrap">
                                            <input type="checkbox" id="print-sleeve-toggle">
                                            <span class="machuda-switch-slider"></span>
                                        </label>
                                        <span class="machuda-zone-title"><i class="xi-compress"></i> 소매 (왼쪽/오른쪽) 인쇄</span>
                                        <span class="machuda-zone-badge" id="badge-sleeve">미선택</span>
                                    </div>
                                    
                                    <div class="machuda-zone-body" id="body-sleeve">
                                        <div class="machuda-options-grid">
                                            <div class="machuda-option-group">
                                                <label>인쇄 방식</label>
                                                <select class="print-method" id="method-sleeve">
                                                    <option value="screen" selected>졸나염 (실시간 자동 계산)</option>
                                                    <option value="silk">실크 / 발포 / 금분 / 은분 나염 (실시간 자동 계산)</option>
                                                    <option value="flock">후로피 (실시간 자동 계산)</option>
                                                    <option value="transfer">실사 / 우레탄 (실시간 자동 계산)</option>
                                                    <option value="embroidery">컴퓨터 자수 (견적 별도 문의)</option>
                                                </select>
                                                <div class="print-inquiry-warning" id="warning-sleeve" style="display:none;">
                                                    <i class="xi-warning"></i> 자수/전사 인쇄는 디테일에 따라 가격 변동이 심하여 카카오톡이나 전화로 도안 전달 후 별도 견적을 받아보셔야 합니다.
                                                </div>
                                            </div>
                                            <div class="machuda-option-group sub-option" id="sub-sleeve-screen">
                                                <label>나염 색상 도수</label>
                                                <select class="print-colors" id="colors-sleeve">
                                                    <option value="1" selected>1도 (단색)</option>
                                                    <option value="2">2도 (두 가지 색)</option>
                                                    <option value="3">3도 (세 가지 색)</option>
                                                </select>
                                            </div>
                                            <div class="machuda-option-group">
                                                <label>인쇄 크기</label>
                                                <select class="print-size" id="size-sleeve">
                                                    <option value="small" selected>소형 (기본 어깨/소매 사이즈)</option>
                                                    <option value="large">대형 (소매 라인 세로 배치)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- STEP 4: Benefits -->
                        <div class="machuda-config-section" id="step-extra">
                            <div class="machuda-section-title">
                                <span class="machuda-step-num">04</span>
                                <h3>실시간 적용 혜택</h3>
                            </div>
                            
                            <div class="machuda-extra-options-list">
                                <label class="machuda-extra-item benefit-style">
                                    <input type="checkbox" id="benefit-teacher">
                                    <span class="machuda-checkbox-custom"></span>
                                    <div class="extra-txt">
                                        <strong>반티 구매 (선생님 티셔츠 1장 무료) <span class="disc-tag">혜택 1</span></strong>
                                        <p>반티 주문 시 선생님용 의류 1벌을 무료로 제공합니다. (10벌 이상 주문 시 적용 가능)</p>
                                    </div>
                                </label>
                                
                                <div class="machuda-extra-item benefit-style machuda-disabled-look" id="benefit-large-qty-indicator">
                                    <div class="machuda-machuda-checkbox-custom-static"><i class="xi-gift"></i></div>
                                    <div class="extra-txt">
                                        <strong>100장 이상 대량 주문 (소형 나염 무료 인쇄) <span class="disc-tag">혜택 2</span></strong>
                                        <p id="benefit-large-qty-desc">주문 수량이 100장 이상일 때 소형 나염 인쇄 비용이 자동으로 0원 처리됩니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <!-- Right Side: Sticky Report / Dashboard -->
                    <section class="machuda-dashboard-panel">
                        <div class="sticky-wrapper">
                            
                            <div class="machuda-report-card">
                                
                                <div class="machuda-report-header">
                                    <h3>MACHUDA ESTIMATE</h3>
                                    <span class="machuda-live-indicator"><span class="machuda-pulse"></span>실시간 계산됨</span>
                                </div>
                                
                                <div class="machuda-report-product-info">
                                    <div class="info-garment">
                                        <span class="label">선택 의류</span>
                                        <strong id="rep-garment-name">30수 라운드 반팔티</strong>
                                    </div>
                                    <div class="info-qty">
                                        <span class="label">주문 수량</span>
                                        <strong><span id="rep-qty">30</span>벌</strong>
                                    </div>
                                </div>
                                
                                <hr class="machuda-divider">
                                
                                <!-- Cost Details Breakdown -->
                                <div class="machuda-cost-breakdown">
                                    
                                    <div class="machuda-breakdown-row">
                                        <span>기본 의류 비용</span>
                                        <span class="val" id="val-base-garment">249,000원</span>
                                    </div>
                                    
                                    <div class="machuda-breakdown-row">
                                        <span>인쇄 제작 비용</span>
                                        <span class="val" id="val-print-work">45,000원</span>
                                    </div>
                                    
                                    <div class="machuda-breakdown-row discount-row" id="row-teacher-discount" style="display:none;">
                                        <span>반티 혜택 (선생님 티 1장 무료)</span>
                                        <span class="val minus" id="val-teacher-discount">-0원</span>
                                    </div>

                                </div>
                                
                                <div class="machuda-tier-progress-area">
                                    <div class="machuda-tier-label">
                                        <span id="current-tier-desc">30벌 돌파! 3% 수량 할인 중</span>
                                        <span class="target-left" id="target-tier-desc">20벌 더 채우면 5% 할인 + 판비 50%</span>
                                    </div>
                                    <div class="machuda-progress-bar">
                                        <div class="machuda-progress-fill" id="machuda-progress-fill" style="width: 30%;"></div>
                                    </div>
                                </div>

                                <hr class="machuda-divider">
                                
                                <!-- Totals Area -->
                                <div class="machuda-report-totals">
                                    
                                    <div class="machuda-total-row machuda-main-total">
                                        <span>예상 견적 총액</span>
                                        <strong id="val-grand-total">382,000원</strong>
                                    </div>
                                    
                                    <div class="machuda-total-row machuda-unit-total">
                                        <span>1벌당 평균 단가</span>
                                        <span id="val-unit-price">12,733원</span>
                                    </div>
                                    
                                </div>

                                <!-- Action Buttons -->
                                <div class="machuda-action-buttons-wrap">
                                    <button type="button" class="machuda-btn-primary" onclick="window.print()">
                                        <i class="xi-print"></i> 견적서 인쇄 / PDF 저장
                                    </button>
                                    <button type="button" class="machuda-btn-secondary" id="btn-copy-quote">
                                        <i class="xi-share-alt"></i> 카카오톡 공유 내용 복사
                                    </button>
                                </div>
                                
                                <p class="machuda-footnote" style="color: var(--color-danger); font-weight: 500;">현금액은 가견적 일뿐, 실제 결제 금액과 차이가 있을 수 있습니다.</p>
                                
                             </div>
                        </div>
                    </section>
                    
                </div>
            </main>
        </div>
    </div>
</div>

<!-- Printable Quotation Template (Hidden on screen, shown on print) -->
<div id="print-invoice-sheet" class="print-only">
    <div class="invoice-header">
        <h1>단체복 제작 비교 견적서</h1>
        <div class="invoice-meta">
            <p><strong>발행일자:</strong> <span id="invoice-date">2026-05-24</span></p>
            <p><strong>공급업체:</strong> 송지웨어 (마추다)</p>
            <p><strong>연락처:</strong> 02-2252-8082 / 010-9992-8082</p>
        </div>
    </div>
    
    <table class="invoice-table">
        <thead>
            <tr>
                <th>구분</th>
                <th>상세 내역</th>
                <th>수량</th>
                <th>단가</th>
                <th>금액</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>선택 의류</td>
                <td id="inv-garment-name">30수 라운드 반팔티</td>
                <td id="inv-qty">30벌</td>
                <td id="inv-garment-unit">8,300원</td>
                <td id="inv-garment-total">249,000원</td>
            </tr>
            <tr id="inv-row-print">
                <td>인쇄 가공</td>
                <td id="inv-print-desc">전면: 나염 인쇄 대형 (1도)</td>
                <td id="inv-print-qty">30벌</td>
                <td id="inv-print-unit">1,500원</td>
                <td id="inv-print-total">45,000원</td>
            </tr>
            <tr class="inv-summary-row">
                <td colspan="4" class="lbl">공급 가액 총액</td>
                <td id="inv-subtotal">382,000원</td>
            </tr>
            <tr class="inv-summary-row discount" id="inv-row-teacher-discount" style="display:none;">
                <td colspan="4" class="lbl">반티 혜택 (선생님 티셔츠 1장 무료)</td>
                <td id="inv-teacher-discount">-0원</td>
            </tr>
            <tr class="inv-summary-row grand-total">
                <td colspan="4" class="lbl">최종 합계 금액</td>
                <td id="inv-grand-total">382,000원</td>
            </tr>
        </tbody>
    </table>
    
    <div class="invoice-footer">
        <p>본 견적서는 실시간 시뮬레이션 금액으로, 최종 주문 시 상세 시안에 따라 변동 가능합니다.</p>
        <p class="stamp">마추다 (송지웨어) 대표 송기영 (인)</p>
    </div>
</div>

<!-- Floating KakaoTalk Widget -->
<div class="floating-kakao-widget" id="floating-kakao-widget">
    <span class="widget-tooltip">실시간 견적 상담 중</span>
    <div class="widget-icon">
        <i class="xi-speech"></i>
        <span class="badge-dot"></span>
    </div>
</div>

<!-- Sticky Bottom CTA Bar -->
<div class="sticky-bottom-cta-bar" id="sticky-bottom-cta-bar">
    <div class="cta-bar-container">
        <div class="cta-text-side">
            <strong>간편 견적 & 실시간 시안 문의</strong>
            <p>카톡으로 디자인 도안만 전송해 주시면 10분 내 견적이 확정됩니다!</p>
        </div>
        <div class="cta-actions-side">
            <button type="button" class="btn-kakao-cta" id="btn-kakao-cta">
                <i class="xi-speech"></i> 빠른 카톡 문의
            </button>
            <a href="https://machuda.com/board/product/write.html?board_no=1002" target="_blank" class="btn-order-cta">
                주문하기
            </a>
            <button type="button" class="btn-calculator-cta" id="btn-calculator-cta">
                실시간 견적기 실행
            </button>
        </div>
    </div>
</div>
`;

const MACHUDA_PORTFOLIO_MODAL_HTML = `
<!-- Portfolio Detail Modal Overlay -->
<div class="machuda-portfolio-modal-overlay" id="machuda-portfolio-modal">
    <div class="machuda-portfolio-modal-container">
        <button type="button" class="machuda-portfolio-btn-close" id="machuda-portfolio-btn-close">&times;</button>
        <div class="machuda-portfolio-modal-content">
            <div class="machuda-portfolio-media-side">
                <img id="machuda-portfolio-detail-img" src="" alt="Portfolio Detail">
            </div>
            <div class="machuda-portfolio-info-side">
                <div class="machuda-portfolio-modal-header">
                    <span class="machuda-portfolio-badge" id="machuda-portfolio-detail-category">카테고리</span>
                    <h2 id="machuda-portfolio-detail-title">포트폴리오 제목</h2>
                </div>
                <div class="machuda-portfolio-specs">
                    <div class="machuda-spec-row">
                        <span class="machuda-spec-label"><i class="xi-check-circle-o"></i> 의류 종류</span>
                        <span class="machuda-spec-val" id="machuda-portfolio-detail-product">제품명</span>
                    </div>
                    <div class="machuda-spec-row">
                        <span class="machuda-spec-label"><i class="xi-check-circle-o"></i> 원단 사양</span>
                        <span class="machuda-spec-val" id="machuda-portfolio-detail-fabric">원단 사양</span>
                    </div>
                    <div class="machuda-spec-row">
                        <span class="machuda-spec-label"><i class="xi-check-circle-o"></i> 인쇄 방식</span>
                        <span class="machuda-spec-val" id="machuda-portfolio-detail-print">인쇄 방식</span>
                    </div>
                </div>
                <div class="machuda-portfolio-tip-box">
                    <h5><i class="xi-info-o"></i> 제작 가이드 & 팁</h5>
                    <p id="machuda-portfolio-detail-tip">팁 내용이 여기에 들어갑니다.</p>
                </div>
                <div class="machuda-portfolio-actions">
                    <button type="button" class="machuda-btn-apply-quote" id="machuda-btn-apply-quote">
                        <i class="xi-calculator"></i> 이 디자인 그대로 견적내기
                    </button>
                    <a href="#" id="machuda-portfolio-detail-link" class="machuda-btn-view-detail" target="_blank" style="display:none;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        납품 상세 본문 보기
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
`;

const initMachudaCalculator = () => {

    // [마추다 보호] 글쓰기/수정 페이지에서는 견적기·포트폴리오 UI 를 초기화하지 않음
    const isWriteOrModifyPage = window.location.pathname.includes('/write.html') ||
                                 window.location.pathname.includes('/modify.html');

    // --- Dynamic DOM Injection ---
    const loadExternalAssets = () => {
        // Fonts
        if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
            const linkFont1 = document.createElement('link');
            linkFont1.rel = 'stylesheet';
            linkFont1.href = 'https://fonts.googleapis.com/css?family=Noto+Sans+KR:100,300,400,500,700,900&subset=korean';
            document.head.appendChild(linkFont1);

            const linkFont2 = document.createElement('link');
            linkFont2.rel = 'stylesheet';
            linkFont2.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap';
            document.head.appendChild(linkFont2);
        }
        // Xeicon
        if (!document.querySelector('link[href*="xeicon"]')) {
            const linkXeicon = document.createElement('link');
            linkXeicon.rel = 'stylesheet';
            linkXeicon.href = 'https://cdn.jsdelivr.net/npm/@xpressengine/xeicon@2.3.3/xeicon.min.css';
            document.head.appendChild(linkXeicon);
        }
    };

    loadExternalAssets();

    if (!isWriteOrModifyPage) {
    // Check if container already exists to prevent duplicate injections
    let container = document.getElementById('machuda-calculator-widget-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'machuda-calculator-widget-container';
        container.innerHTML = MACHUDA_CALCULATOR_HTML + MACHUDA_PORTFOLIO_MODAL_HTML;
        document.body.appendChild(container);
        document.body.classList.add('machuda-has-cta');
    } else {
        // 만약 컨테이너는 존재하는데 포트폴리오 모달이 없다면 추가 주입 (이벤트 보존을 위해 insertAdjacentHTML 사용)
        if (!document.getElementById('machuda-portfolio-modal')) {
            container.insertAdjacentHTML('beforeend', MACHUDA_PORTFOLIO_MODAL_HTML);
        }
    }


    // --- Product Database ---
    const PRODUCT_DATABASE = [
        { id: 'tee30', name: '30수 라운드 반팔티', price: 8300, category: '반팔/폴로티', desc: '가볍고 베이직한 단체티의 표준' },
        { id: 'tee20', name: '20수 라운드 반팔티', price: 9500, category: '반팔/폴로티', desc: '두툼하고 비침이 적어 고품질을 지향하는 반팔' },
        { id: 'polo_dry', name: '[톰스] 드라이 폴로 카라티', price: 10600, category: '반팔/폴로티', desc: '땀 흡수와 기능성이 뛰어난 기능성 카라티' },
        { id: 'polo_tc', name: '[톰스] T/C 폴로셔츠', price: 12300, category: '반팔/폴로티', desc: '고급 면혼방 소재 of 정갈한 카라티' },
        { id: 'hoodie_heavy', name: '[이지와이] 레브 헤비쭈리 후드티', price: 30500, category: '후드/맨투맨', desc: '도톰하고 핏이 살아있는 시그니처 후드' },
        { id: 'mtm_heavy', name: '[이지와이] 레브 헤비쭈리 맨투맨', price: 24200, category: '후드/맨투맨', desc: '단정하고 캐주얼한 데일리 단체복' },
        { id: 'zip_heavy', name: '[이지와이] 레브 헤비쭈리 후드집업', price: 36400, category: '후드/맨투맨', desc: '어디에나 입기 좋은 오버핏 후드집업' },
        { id: 'toms_zip', name: '[톰스] 헤비 쮸리 후드 집업 00189-NNZ', price: 31900, category: '후드/맨투맨', desc: '짱짱한 원단감의 슬림핏 후드 집업' },
        { id: 'varsity_classic', name: '마추다 프리미엄 야구점퍼 (과잠)', price: 44000, category: '아우터', desc: '프리미엄 자수가 어울리는 하이퀄리티 아우터' },
        { id: 'windbreaker_staff', name: '마추다 프리미엄 스태프 바람막이', price: 28000, category: '아우터', desc: '방풍 및 방수 기능이 뛰어난 고급 바람막이 아우터' },
        { id: 'staff_tee', name: '스탭티 20수 (행사용)', price: 11800, category: '행사복', desc: '봉사, 축제 등 다양한 행사용 스태프티' },
        { id: 'staff_hoodie', name: '스탭 후드티 (행사용)', price: 20000, category: '행사복', desc: '이목을 끌기 좋은 스태프용 후드티' },
        { id: 'vest_taslan', name: '타스란 도우미 조끼', price: 9000, category: '조끼', desc: '스태프 및 자원봉사용 실용적인 조끼' },
        { id: 'vest_security', name: '방범 조끼 s510', price: 20300, category: '조끼', desc: '어두운 야외 활동을 위한 시인성 안전 조끼' },
        { id: 'vest_office', name: '오피스 조끼 LD69', price: 18700, category: '조끼', desc: '오피스 및 실내 업무용 깔끔한 주머니 조끼' },
        { id: 'sauna_basic', name: '기본형 베스트 찜질복 세트', price: 20600, category: '기타/특수복', desc: '찜질방 및 사우나 단체복의 스탠다드' },
        { id: 'sauna_ynack', name: '고급형 와이넥 찜질복 세트', price: 22200, category: '기타/특수복', desc: '편안한 와이넥 칼라의 프리미엄 찜질복' },
        { id: 'family_love', name: '사랑하는 한가족 패밀리룩티', price: 14900, category: '기타/특수복', desc: '가족 모임, 행사용 사랑스러운 가족티' },
        { id: 'ecobag_custom', name: '마추다 추천 에코백', price: 4000, category: '굿즈/에코백', desc: '다용도로 활용 가능한 주문제작형 에코백' }
    ];

    // --- State Variables ---
    let activeProduct = PRODUCT_DATABASE[0]; // Default: 30수 라운드 반팔티

    // --- Pricing Configuration (New Print Rates Table) ---
    const PRINT_PRICES = {
        screen: { // 졸나염
            under100: { small: 44000, large: 55000, huge: 77000 },
            over100: { small: 440, large: 550, huge: 770 }
        },
        silk: { // 실크 / 발포 / 금분 / 은분 나염
            under100: { small: 88000, large: 110000, huge: 154000 },
            over100: { small: 880, large: 1100, huge: 1540 }
        },
        flock: { // 후로피
            tier1_9: { small: 5500, large: 8800, huge: 12100 },
            tier10_30: { small: 3300, large: 4400, huge: 6600 },
            tier31_up: { small: 2750, large: 3300, huge: 5500 }
        },
        transfer: { // 실사 / 우레탄
            tier1_9: { small: 6600, large: 9900, huge: 13200 },
            tier10_30: { small: 4400, large: 6600, huge: 8800 },
            tier31_up: { small: 3300, large: 5500, huge: 7700 }
        }
    };

    // --- DOM Elements ---
    const qtySlider = document.getElementById('qty-slider');
    const qtyNumber = document.getElementById('qty-number');
    
    // Search elements
    const searchInput = document.getElementById('product-search-input');
    const searchResultsList = document.getElementById('search-results-list');
    const selectedProductPreview = document.getElementById('selected-product-preview');
    const previewImageWrap = document.getElementById('preview-image-wrap');
    const previewCategory = document.getElementById('preview-category');
    const previewName = document.getElementById('preview-name');
    const previewPrice = document.getElementById('preview-price');
    const btnChangeProduct = document.getElementById('btn-change-product');
    
    // Custom entry form elements
    const btnToggleCustom = document.getElementById('btn-toggle-custom');
    const customProductForm = document.getElementById('custom-product-form');
    const customNameInput = document.getElementById('custom-name');
    const customPriceInput = document.getElementById('custom-price');
    const btnApplyCustom = document.getElementById('btn-apply-custom');

    // Toggles & Sections for print zones
    const zones = ['front', 'back', 'sleeve'];
    const zoneElements = {};
    zones.forEach(zone => {
        zoneElements[zone] = {
            toggle: document.getElementById(`print-${zone}-toggle`),
            body: document.getElementById(`body-${zone}`),
            method: document.getElementById(`method-${zone}`),
            colorsGroup: document.getElementById(`sub-${zone}-screen`),
            colors: document.getElementById(`colors-${zone}`),
            size: document.getElementById(`size-${zone}`),
            badge: document.getElementById(`badge-${zone}`),
            warning: document.getElementById(`warning-${zone}`)
        };
    });

    // Extras & Benefits
    const benefitTeacher = document.getElementById('benefit-teacher');
    const benefitLargeQtyIndicator = document.getElementById('benefit-large-qty-indicator');
    const benefitLargeQtyDesc = document.getElementById('benefit-large-qty-desc');

    // On-screen Reports
    const repGarmentName = document.getElementById('rep-garment-name');
    const repQty = document.getElementById('rep-qty');
    const valBaseGarment = document.getElementById('val-base-garment');
    const valPrintWork = document.getElementById('val-print-work');
    const valTeacherDiscount = document.getElementById('val-teacher-discount');
    const valGrandTotal = document.getElementById('val-grand-total');
    const valUnitPrice = document.getElementById('val-unit-price');
    
    // Rows display
    const rowTeacherDiscount = document.getElementById('row-teacher-discount');
    
    // Progress Bar
    const currentTierDesc = document.getElementById('current-tier-desc');
    const targetTierDesc = document.getElementById('target-tier-desc');
    const progressFill = document.getElementById('machuda-progress-fill');
    
    // Print/Invoice sheet elements
    const invoiceDate = document.getElementById('invoice-date');
    const invGarmentName = document.getElementById('inv-garment-name');
    const invQty = document.getElementById('inv-qty');
    const invGarmentUnit = document.getElementById('inv-garment-unit');
    const invGarmentTotal = document.getElementById('inv-garment-total');
    const invRowPrint = document.getElementById('inv-row-print');
    const invPrintDesc = document.getElementById('inv-print-desc');
    const invPrintQty = document.getElementById('inv-print-qty');
    const invPrintUnit = document.getElementById('inv-print-unit');
    const invPrintTotal = document.getElementById('inv-print-total');
    const invSubtotal = document.getElementById('inv-subtotal');
    const invRowTeacherDiscount = document.getElementById('inv-row-teacher-discount');
    const invTeacherDiscount = document.getElementById('inv-teacher-discount');
    const invGrandTotal = document.getElementById('inv-grand-total');

    const btnCopyQuote = document.getElementById('btn-copy-quote');

    // --- Helper Functions ---
    const formatWon = (value) => {
        return Math.round(value).toLocaleString('ko-KR') + '원';
    };

    const updateSliderMarkers = (qty) => {
        const markers = document.querySelectorAll('.machuda-discount-markers .machuda-marker');
        markers.forEach(marker => {
            const val = parseInt(marker.dataset.val);
            if (qty >= val) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    };

    // --- Search & UI List Population ---
    // --- Async Cafe24 Shop Product Fetcher & Parser ---
    const fetchWebsiteProducts = async (query) => {
        if (!query || query.trim().length < 2) return [];
        try {
            const response = await fetch('/product/search.html?keyword=' + encodeURIComponent(query));
            if (!response.ok) return [];
            const htmlText = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const items = doc.querySelectorAll('.prdList .item, .prdList > li, .prdList_search .item');
            const products = [];
            
            items.forEach(item => {
                // Extract ID
                const idAttr = item.getAttribute('id') || '';
                const id = idAttr.replace('anchorBoxId_', '') || Math.random().toString(36).substr(2, 9);
                
                // Extract Name
                const nameEl = item.querySelector('.name a');
                if (!nameEl) return;
                const clone = nameEl.cloneNode(true);
                const titleEl = clone.querySelector('.title');
                if (titleEl) titleEl.remove();
                const name = clone.textContent.trim().replace(/^:\s*/, '');
                
                // Extract Price
                let priceText = '';
                const priceEl = item.querySelector('.discount_rate');
                if (priceEl && priceEl.getAttribute('data-sale')) {
                    priceText = priceEl.getAttribute('data-sale');
                } else if (item.getAttribute('data-price')) {
                    priceText = item.getAttribute('data-price');
                } else {
                    const descEl = item.querySelector('.description, .spec');
                    if (descEl) {
                        const priceMatch = descEl.textContent.match(/판매가\s*:\s*([0-9,]+)\s*원/) || descEl.textContent.match(/([0-9,]+)\s*원/);
                        if (priceMatch) {
                            priceText = priceMatch[1];
                        }
                    }
                }
                const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
                
                // Extract Image
                let imgUrl = '';
                const imgEl = item.querySelector('.thumbnail img');
                if (imgEl) {
                    imgUrl = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '';
                    if (imgUrl.startsWith('//')) {
                        imgUrl = 'https:' + imgUrl;
                    }
                }
                
                // Extract Description/Summary
                let desc = '';
                const specItem = item.querySelector('.spec li, .description li');
                if (specItem) {
                    const cloneDesc = specItem.cloneNode(true);
                    const titleEl = cloneDesc.querySelector('.title');
                    if (titleEl) titleEl.remove();
                    desc = cloneDesc.textContent.trim().replace(/^\s*:\s*/, '');
                }
                
                // Extract Link
                const linkEl = item.querySelector('.thumbnail a, .name a');
                const link = linkEl ? linkEl.getAttribute('href') : '';
                
                products.push({
                    id: id,
                    name: name,
                    price: price,
                    category: '쇼핑몰 상품',
                    desc: desc || '실시간 쇼핑몰 검색 상품',
                    img: imgUrl,
                    link: link
                });
            });
            return products;
        } catch (error) {
            console.error('Error fetching/parsing shop products:', error);
            return [];
        }
    };

    // --- Search & UI List Population ---
    const renderProductList = (query = '', webProducts = [], isLoadingWeb = false) => {
        searchResultsList.innerHTML = '';
        
        const cleanQuery = query.trim().toLowerCase();
        
        // 1. Filter local database
        const localFiltered = PRODUCT_DATABASE.filter(prod => {
            return prod.name.toLowerCase().includes(cleanQuery) || 
                   prod.category.toLowerCase().includes(cleanQuery);
        });

        // 2. Combine results, avoiding duplicates
        const combined = [...localFiltered];
        webProducts.forEach(webProd => {
            const exists = combined.some(p => p.name.trim() === webProd.name.trim() || p.id === webProd.id);
            if (!exists) {
                combined.push(webProd);
            }
        });

        // Show spinner if loading and list is empty
        if (isLoadingWeb && combined.length === 0) {
            searchResultsList.innerHTML = `
                <div class="machuda-search-spinner">
                    <div class="machuda-spinner-icon"></div>
                    <div>쇼핑몰에서 상품을 검색하는 중입니다...</div>
                </div>
            `;
            return;
        }

        if (combined.length === 0) {
            searchResultsList.innerHTML = `<div style="text-align:center; padding:20px; color:var(--color-text-muted); font-size:13px;">검색 결과가 없습니다.</div>`;
            return;
        }

        combined.forEach(prod => {
            const row = document.createElement('div');
            row.className = 'search-item-row';
            
            const imgHtml = prod.img ? `<img src="${prod.img}" class="search-item-thumb" alt="${prod.name}" />` : '';
            const categoryText = prod.category || '쇼핑몰 상품';
            const descText = prod.desc || '실시간 쇼핑몰 검색 상품';
            
            row.innerHTML = `
                <div class="search-item-left">
                    ${imgHtml}
                    <div class="search-item-details">
                        <span class="search-item-category">${categoryText}</span>
                        <strong class="search-item-name" title="${prod.name}">${prod.name}</strong>
                        <p class="search-item-desc" title="${descText}">${descText}</p>
                    </div>
                </div>
                <div class="search-item-action">
                    <span class="search-item-price">${formatWon(prod.price)}</span>
                    <button type="button" class="btn-select-product">선택</button>
                </div>
            `;
            
            row.querySelector('.btn-select-product').addEventListener('click', () => {
                selectProduct(prod);
            });
            
            searchResultsList.appendChild(row);
        });

        // Show inline loader if fetching additional products from web
        if (isLoadingWeb) {
            const loaderRow = document.createElement('div');
            loaderRow.className = 'machuda-search-spinner';
            loaderRow.style.padding = '12px';
            loaderRow.style.flexDirection = 'row';
            loaderRow.style.borderTop = '1px dashed var(--color-border)';
            loaderRow.innerHTML = `
                <div class="machuda-spinner-icon" style="width: 16px; height: 16px; border-width: 2px;"></div>
                <div style="font-size: 11px;">쇼핑몰에서 추가 상품 검색 중...</div>
            `;
            searchResultsList.appendChild(loaderRow);
        }
    };

    const selectProduct = (product) => {
        activeProduct = product;
        
        // Hide product list and search input
        searchInput.style.display = 'none';
        searchResultsList.style.display = 'none';
        btnToggleCustom.parentElement.style.display = 'none';
        customProductForm.style.display = 'none';
        
        // Show selection preview
        previewCategory.textContent = product.category || '의류';
        previewName.textContent = product.name;
        previewPrice.innerHTML = `${formatWon(product.price)} <small>/벌</small>`;
        
        // Update product image or fallback icon
        if (product.img) {
            previewImageWrap.innerHTML = `<img src="${product.img}" class="preview-thumb" alt="${product.name}" />`;
        } else {
            previewImageWrap.innerHTML = `<div class="preview-icon"><i class="xi-check-circle"></i></div>`;
        }
        
        selectedProductPreview.style.display = 'block';
        
        calculateQuote();
    };

    const showProductSearch = () => {
        selectedProductPreview.style.display = 'none';
        
        // Restore search UI
        searchInput.value = '';
        searchInput.style.display = 'block';
        searchResultsList.style.display = 'block';
        btnToggleCustom.parentElement.style.display = 'block';
        
        renderProductList('', [], false);
    };

    // --- Calculation Core Logic ---
    const calculateQuote = () => {
        const qty = parseInt(qtyNumber.value) || 1;
        const garment = activeProduct;

        // 1. Basic Garment Cost (Tiered Qty Discount)
        let qtyDiscountRate = 0;
        if (qty >= 10 && qty < 30) qtyDiscountRate = 0.02;      // 10-29 pcs: 2%
        else if (qty >= 30 && qty < 50) qtyDiscountRate = 0.03; // 30-49 pcs: 3%
        else if (qty >= 50 && qty < 100) qtyDiscountRate = 0.05;// 50-99 pcs: 5%
        else if (qty >= 100) qtyDiscountRate = 0.10;            // 100+ pcs: 10%

        const discountedGarmentPrice = garment.price * (1 - qtyDiscountRate);
        const baseGarmentCost = discountedGarmentPrice * qty;

        // 2. Printing Fabrication Cost
        let totalPrintWorkCost = 0;
        let printDescriptions = [];
        let hasInquiryOnlyPrint = false;
        let hasFreePrintBenefit = false;

        zones.forEach(zone => {
            const el = zoneElements[zone];
            
            if (el.toggle && el.toggle.checked) {
                const method = el.method.value;
                const size = el.size.value;
                let zoneCost = 0;
                let desc = '';
                
                let zoneName = '전면';
                if (zone === 'back') zoneName = '후면';
                if (zone === 'sleeve') zoneName = '소매';

                let sizeName = '소형';
                if (size === 'large') sizeName = '대형';
                if (size === 'huge') sizeName = '특대형';

                if (method === 'screen') {
                    const colors = parseInt(el.colors.value) || 1;
                    if (qty >= 100) {
                        if (size === 'small') {
                            // Benefit 2: 100+ small screen print is free!
                            zoneCost = 0;
                            hasFreePrintBenefit = true;
                            desc = `${zoneName}: 졸나염(${colors}도/소형) [100장 무료 인쇄]`;
                        } else {
                            const unit = PRINT_PRICES.screen.over100[size];
                            zoneCost = unit * colors * qty;
                            desc = `${zoneName}: 졸나염(${colors}도/${sizeName}/장당 ${formatWon(unit)})`;
                        }
                    } else {
                        const flat = PRINT_PRICES.screen.under100[size];
                        zoneCost = flat * colors;
                        desc = `${zoneName}: 졸나염(${colors}도/${sizeName}/기본 인쇄비 ${formatWon(flat)})`;
                    }
                } else if (method === 'silk') {
                    if (qty >= 100) {
                        if (size === 'small') {
                            // Benefit 2: 100+ small screen print is free!
                            zoneCost = 0;
                            hasFreePrintBenefit = true;
                            desc = `${zoneName}: 실크나염(1도/소형) [100장 무료 인쇄]`;
                        } else {
                            const unit = PRINT_PRICES.silk.over100[size];
                            zoneCost = unit * qty;
                            desc = `${zoneName}: 실크나염(1도/${sizeName}/장당 ${formatWon(unit)})`;
                        }
                    } else {
                        const flat = PRINT_PRICES.silk.under100[size];
                        zoneCost = flat;
                        desc = `${zoneName}: 실크나염(1도/${sizeName}/기본 인쇄비 ${formatWon(flat)})`;
                    }
                } else if (method === 'flock') {
                    const colors = parseInt(el.colors.value) || 1;
                    let unit = 0;
                    if (qty <= 9) {
                        unit = PRINT_PRICES.flock.tier1_9[size];
                    } else if (qty <= 30) {
                        unit = PRINT_PRICES.flock.tier10_30[size];
                    } else {
                        unit = PRINT_PRICES.flock.tier31_up[size];
                    }
                    zoneCost = unit * colors * qty;
                    desc = `${zoneName}: 후로피(${colors}도/${sizeName}/장당 ${formatWon(unit)})`;
                } else if (method === 'transfer') {
                    const colors = parseInt(el.colors.value) || 1;
                    let unit = 0;
                    if (qty <= 9) {
                        unit = PRINT_PRICES.transfer.tier1_9[size];
                    } else if (qty <= 30) {
                        unit = PRINT_PRICES.transfer.tier10_30[size];
                    } else {
                        unit = PRINT_PRICES.transfer.tier31_up[size];
                    }
                    zoneCost = unit * colors * qty;
                    desc = `${zoneName}: 실사우레탄(${colors}도/${sizeName}/장당 ${formatWon(unit)})`;
                } else if (method === 'embroidery') {
                    hasInquiryOnlyPrint = true;
                    desc = `${zoneName}: 컴퓨터 자수 (견적 문의)`;
                }

                totalPrintWorkCost += zoneCost;
                if (desc) printDescriptions.push(desc);
            }
        });

        // 3. Benefit 1: Teacher Tee Free (qty >= 10, benefitTeacher is checked)
        if (benefitTeacher.checked && qty < 10) {
            benefitTeacher.checked = false; // Auto-uncheck if qty drops below 10
        }
        const teacherDiscount = (benefitTeacher.checked && qty >= 10) ? garment.price : 0;

        // 4. Subtotal & Grand Total
        const subtotal = baseGarmentCost + totalPrintWorkCost;
        const grandTotal = subtotal - teacherDiscount;
        const unitPrice = grandTotal / qty;

        // --- Render On-Screen Dashboard ---
        repGarmentName.textContent = garment.name;
        repQty.textContent = qty;
        
        valBaseGarment.textContent = formatWon(baseGarmentCost);
        
        // Handle printing cost displays for inquiry methods
        if (hasInquiryOnlyPrint) {
            valPrintWork.textContent = '별도 문의 (자수)';
            valGrandTotal.textContent = `의류가액 ${formatWon(grandTotal - totalPrintWorkCost)} + 인쇄비 별도`;
            valUnitPrice.textContent = '별도 문의';
        } else {
            valPrintWork.textContent = formatWon(totalPrintWorkCost);
            valGrandTotal.textContent = formatWon(grandTotal);
            valUnitPrice.textContent = formatWon(unitPrice);
        }

        if (teacherDiscount > 0) {
            rowTeacherDiscount.style.display = 'flex';
            valTeacherDiscount.textContent = `-${formatWon(teacherDiscount)}`;
        } else {
            rowTeacherDiscount.style.display = 'none';
        }

        // --- Update Progress Bar & Tiers (Keyed to 100-pc free small print benefit) ---
        let fillWidth = (qty / 100) * 100;
        if (fillWidth > 100) fillWidth = 100;
        
        let curTier = '';
        let targetTier = '';
        
        if (qty >= 100) {
            benefitLargeQtyIndicator.classList.remove('machuda-disabled-look');
            benefitLargeQtyDesc.innerHTML = `<span style="color:var(--color-primary); font-weight:700;">자동 적용 완료!</span> 모든 소형 나염 인쇄 비용이 0원으로 계산됩니다.`;
            curTier = '100장 돌파! 대량 주문 혜택 적용 완료';
            targetTier = '소형 나염 무료 인쇄 혜택 적용 중! 🎉';
        } else {
            benefitLargeQtyIndicator.classList.add('machuda-disabled-look');
            benefitLargeQtyDesc.textContent = '주문 수량이 100장 이상일 때 소형 나염 인쇄 비용이 자동으로 0원 처리됩니다.';
            curTier = `현재 ${qty}벌 선택 중`;
            targetTier = `100벌까지 ${100 - qty}벌 더 채우면 소형 나염 무료 인쇄!`;
        }
        
        progressFill.style.width = `${fillWidth}%`;
        currentTierDesc.textContent = curTier;
        targetTierDesc.textContent = targetTier;

        // --- Render Print Sheet ---
        invGarmentName.textContent = garment.name;
        invQty.textContent = `${qty}벌`;
        invGarmentUnit.textContent = formatWon(garment.price);
        invGarmentTotal.textContent = formatWon(baseGarmentCost);

        if (totalPrintWorkCost > 0 || hasInquiryOnlyPrint) {
            invRowPrint.style.display = 'table-row';
            invPrintDesc.textContent = printDescriptions.join(' + ');
            invPrintQty.textContent = `${qty}벌`;
            
            if (hasInquiryOnlyPrint) {
                invPrintUnit.textContent = '별도 문의';
                invPrintTotal.textContent = '별도 문의';
            } else {
                invPrintUnit.textContent = formatWon(totalPrintWorkCost / qty);
                invPrintTotal.textContent = formatWon(totalPrintWorkCost);
            }
        } else {
            invRowPrint.style.display = 'none';
        }

        invSubtotal.textContent = hasInquiryOnlyPrint ? '별도 문의' : formatWon(subtotal);

        if (teacherDiscount > 0) {
            invRowTeacherDiscount.style.display = 'table-row';
            invTeacherDiscount.textContent = `-${formatWon(teacherDiscount)}`;
        } else {
            invRowTeacherDiscount.style.display = 'none';
        }

        invGrandTotal.textContent = hasInquiryOnlyPrint ? `의류가액 ${formatWon(grandTotal - totalPrintWorkCost)} + 인쇄비 별도` : formatWon(grandTotal);
    };

    // --- Clipboard Share Content Generator ---
    const copyQuoteToClipboard = () => {
        const qty = parseInt(qtyNumber.value) || 1;
        const garment = activeProduct;
        const grandTotal = valGrandTotal.textContent;
        const unitPrice = valUnitPrice.textContent;

        let printInfos = [];
        let hasInquiry = false;
        let hasFreePrintBenefit = false;

        zones.forEach(zone => {
            const el = zoneElements[zone];
            if (el.toggle.checked) {
                const method = el.method.options[el.method.selectedIndex].text;
                const size = el.size.options[el.size.selectedIndex].text;
                printInfos.push(`- ${zone === 'front' ? '전면(앞)' : zone === 'back' ? '후면(뒤)' : '소매'}: ${method} [${size}]`);
                if (el.method.value === 'embroidery') {
                    hasInquiry = true;
                }
                if (qty >= 100 && (el.method.value === 'screen' || el.method.value === 'silk') && el.size.value === 'small') {
                    hasFreePrintBenefit = true;
                }
            }
        });
        const printText = printInfos.length > 0 ? printInfos.join('\n') : '- 인쇄 없음';

        const extraInfos = [];
        if (benefitTeacher.checked && qty >= 10) extraInfos.push('- 반티 혜택: 선생님 티셔츠 1장 무료 적용');
        if (qty >= 100 && hasFreePrintBenefit) extraInfos.push('- 대량 혜택: 100장 이상 소형 나염 무료 인쇄 적용');
        const extraText = extraInfos.length > 0 ? extraInfos.join('\n') : '- 적용된 혜택 없음';

        let quoteMsg = `[마추다 실시간 견적 공유]
■ 선택 의류: ${garment.name}
■ 주문 수량: ${qty}벌
■ 인쇄 정보:
${printText}
■ 적용 혜택:
${extraText}
-----------------------------
★ 장당 평균 가격: ${unitPrice}
★ 예상 견적 총액: ${grandTotal}

* 본 견적은 실시간 자동 산출 가견적입니다.`;

        if (hasInquiry) {
            quoteMsg += `\n⚠️ 자수 인쇄는 디테일(침수)에 따라 단가 차이가 심하여 별도 문의 항목으로 분류되었습니다. 카카오톡 채널로 로고 이미지를 전송해 주시면 최종 견적을 신속히 확정해 드립니다.`;
        }

        quoteMsg += `\n* 카카오톡이나 게시판을 통해 상세 시안 디자인을 첨부하여 접수해주시면 정밀 견적서로 전환됩니다.`;

        navigator.clipboard.writeText(quoteMsg).then(() => {
            const origHTML = btnCopyQuote.innerHTML;
            btnCopyQuote.innerHTML = `<i class="xi-check"></i> 복사 완료!`;
            btnCopyQuote.style.background = 'rgba(16, 185, 129, 0.2)';
            btnCopyQuote.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-success').trim();
            
            setTimeout(() => {
                btnCopyQuote.innerHTML = origHTML;
                btnCopyQuote.style.background = '';
                btnCopyQuote.style.borderColor = '';
            }, 2000);
        }).catch(err => {
            alert('견적서 복사에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        });
    };

    // --- Interactive Listeners Setup ---
    if (qtySlider && qtyNumber && searchInput) {
        // Qty slider & number synchronization
        qtySlider.addEventListener('input', (e) => {
            qtyNumber.value = e.target.value;
            updateSliderMarkers(parseInt(e.target.value));
            calculateQuote();
        });

        qtyNumber.addEventListener('input', (e) => {
            let val = parseInt(e.target.value) || 1;
            if (val > 1000) val = 1000;
            qtySlider.value = val;
            updateSliderMarkers(val);
            calculateQuote();
        });

        // Product search input
        let searchTimeout = null;
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            
            // 1. Instant local filter
            renderProductList(query, [], false);
            
            if (searchTimeout) clearTimeout(searchTimeout);
            
            if (query.trim().length >= 2) {
                // Show local results but with spinner indicating background web search
                renderProductList(query, [], true);
                
                searchTimeout = setTimeout(async () => {
                    const webProducts = await fetchWebsiteProducts(query);
                    renderProductList(query, webProducts, false);
                }, 300);
            }
        });

        if (btnChangeProduct) {
            btnChangeProduct.addEventListener('click', showProductSearch);
        }

        // Custom product form toggle
        if (btnToggleCustom && customProductForm) {
            btnToggleCustom.addEventListener('click', () => {
                if (customProductForm.style.display === 'none') {
                    customProductForm.style.display = 'block';
                    customProductForm.scrollIntoView({ behavior: 'smooth' });
                } else {
                    customProductForm.style.display = 'none';
                }
            });
        }

        // Apply custom product inputs
        if (btnApplyCustom) {
            btnApplyCustom.addEventListener('click', () => {
                const name = customNameInput ? customNameInput.value.trim() : '';
                const price = customPriceInput ? parseInt(customPriceInput.value) : 0;

                if (!name) {
                    alert('상품명을 입력해 주세요.');
                    if (customNameInput) customNameInput.focus();
                    return;
                }
                if (isNaN(price) || price < 0) {
                    alert('유효한 벌당 가격을 입력해 주세요.');
                    if (customPriceInput) customPriceInput.focus();
                    return;
                }

                const customProduct = {
                    id: 'custom',
                    name: name,
                    price: price,
                    category: '직접 입력',
                    desc: '사용자가 직접 가격 정보를 입력한 상품'
                };

                selectProduct(customProduct);
            });
        }

        // Toggle expansion animation for printing zone configurations
        zones.forEach(zone => {
            const el = zoneElements[zone];
            if (el && el.toggle) {
                el.toggle.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        if (el.body) el.body.classList.add('active');
                        if (el.badge) {
                            el.badge.classList.add('active');
                            el.badge.textContent = '선택됨';
                        }
                    } else {
                        if (el.body) el.body.classList.remove('active');
                        if (el.badge) {
                            el.badge.classList.remove('active');
                            el.badge.textContent = '미선택';
                        }
                    }
                    calculateQuote();
                });
            }

            if (el && el.method) {
                // When method changes, handle inputs layout and constraints
                el.method.addEventListener('change', (e) => {
                    const method = e.target.value;
                    if (method === 'screen' || method === 'flock' || method === 'transfer') {
                        if (el.colorsGroup) el.colorsGroup.style.display = 'block';
                        if (el.warning) el.warning.style.display = 'none';
                        if (el.size && el.size.parentElement) el.size.parentElement.style.display = 'flex';
                    } else if (method === 'silk') {
                        if (el.colorsGroup) el.colorsGroup.style.display = 'none';
                        if (el.warning) el.warning.style.display = 'none';
                        if (el.size && el.size.parentElement) el.size.parentElement.style.display = 'flex';
                        if (el.colors) el.colors.value = "1";
                    } else { // embroidery (inquiry-only)
                        if (el.colorsGroup) el.colorsGroup.style.display = 'none';
                        if (el.warning) el.warning.style.display = 'block';
                        if (el.size && el.size.parentElement) el.size.parentElement.style.display = 'none';
                    }
                    calculateQuote();
                });
            }

            if (el && el.colors) {
                el.colors.addEventListener('change', calculateQuote);
            }
            if (el && el.size) {
                el.size.addEventListener('change', calculateQuote);
            }
        });

        // Extras & Benefits options checkboxes
        if (benefitTeacher) {
            benefitTeacher.addEventListener('change', (e) => {
                const qty = parseInt(qtyNumber.value) || 1;
                if (e.target.checked && qty < 10) {
                    alert('선생님 티셔츠 1장 무료 혜택은 10벌 이상 주문 시에만 선택할 수 있습니다.');
                    e.target.checked = false;
                }
                calculateQuote();
            });
        }

        // Copy to clipboard click listener
        if (btnCopyQuote) {
            btnCopyQuote.addEventListener('click', copyQuoteToClipboard);
        }

        // Initial setup
        if (invoiceDate) {
            invoiceDate.textContent = new Date().toISOString().split('T')[0];
        }
        updateSliderMarkers(parseInt(qtySlider.value));
        
        // Set default product selection and render initial list
        selectProduct(PRODUCT_DATABASE[0]);
        renderProductList('', [], false);
    }

    // --- Sticky CTA Bar, Floating Widget & Modal Controls ---
    const calculatorModal = document.getElementById('machuda-calculator-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const floatingKakaoWidget = document.getElementById('floating-kakao-widget');
    const btnKakaoCta = document.getElementById('btn-kakao-cta');
    const btnCalculatorCta = document.getElementById('btn-calculator-cta');

    // Open Machuda KakaoTalk Channel
    const openKakaoChannel = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        window.open('https://pf.kakao.com/_JxbSxbV/chat', '_blank');
    };

    if (floatingKakaoWidget) {
        floatingKakaoWidget.addEventListener('click', openKakaoChannel);
    }
    if (btnKakaoCta) {
        btnKakaoCta.addEventListener('click', openKakaoChannel);
    }

    // Modal Control Handlers
    if (btnCalculatorCta && calculatorModal) {
        btnCalculatorCta.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            calculatorModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent page background scrolling
        });
    }

    if (btnCloseModal && calculatorModal) {
        btnCloseModal.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            calculatorModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore page scrolling
        });

        // Close when clicking overlay backdrop
        calculatorModal.addEventListener('click', (e) => {
            if (e.target === calculatorModal) {
                calculatorModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Portfolio Modal & Calculator Linking Logic ---
    const portfolioModal = document.getElementById('machuda-portfolio-modal');
    const portfolioCloseBtn = document.getElementById('machuda-portfolio-btn-close');
    const detailImg = document.getElementById('machuda-portfolio-detail-img');
    const detailCategory = document.getElementById('machuda-portfolio-detail-category');
    const detailTitle = document.getElementById('machuda-portfolio-detail-title');
    const detailProduct = document.getElementById('machuda-portfolio-detail-product');
    const detailFabric = document.getElementById('machuda-portfolio-detail-fabric');
    const detailPrint = document.getElementById('machuda-portfolio-detail-print');
    const detailTip = document.getElementById('machuda-portfolio-detail-tip');
    const btnApplyQuote = document.getElementById('machuda-btn-apply-quote');

    let activePortfolioCard = null;

    // Open portfolio detail modal
    const openPortfolioDetail = (card) => {
        activePortfolioCard = card;
        
        const imgUrl = card.querySelector('.machuda-card-image-wrap img').src;
        const category = card.getAttribute('data-category');
        const prodName = card.getAttribute('data-prod-name');
        const fabric = card.getAttribute('data-fabric');
        const printDesc = card.getAttribute('data-print-desc');
        const tip = card.getAttribute('data-tip');
        
        let categoryKo = '가게/기타';
        if (category === 'company') categoryKo = '회사/근무복';
        else if (category === 'school') categoryKo = '학교/반티';
        else if (category === 'church') categoryKo = '종교/가족';
        else if (category === 'sports') categoryKo = '동호회/굿즈';
        else if (category === 'sauna') categoryKo = '가게/기타';

        detailImg.src = imgUrl;
        detailCategory.textContent = categoryKo;
        detailTitle.textContent = prodName;
        
        const prodId = card.getAttribute('data-prod-id');
        const matchedProduct = PRODUCT_DATABASE.find(p => p.id === prodId);
        detailProduct.textContent = matchedProduct ? matchedProduct.name : prodName;
        detailFabric.textContent = fabric;
        detailPrint.textContent = printDesc;
        detailTip.textContent = tip;

        // "본문 보기" 링크 업데이트
        const detailLinkBtn = document.getElementById('machuda-portfolio-detail-link');
        const detailUrl = card.getAttribute('data-link') || '';
        if (detailLinkBtn) {
            if (detailUrl) {
                detailLinkBtn.href = detailUrl;
                detailLinkBtn.style.display = 'flex';
            } else {
                detailLinkBtn.style.display = 'none';
            }
        }

        portfolioModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closePortfolioModal = () => {
        portfolioModal.classList.remove('active');
        document.body.style.overflow = '';
        activePortfolioCard = null;
    };

    // --- Cafe24 Board List Page Dynamic Gallery Rendering ---
    const dynamicGrid = document.getElementById('machuda-dynamic-grid');
    const hasRawData = document.getElementById('machuda-raw-data-table') || document.querySelector('#machuda-raw-board-wrap li');
    
    if (dynamicGrid && hasRawData) {
        const getBoardNo = () => {
            // 1. Try search param first (e.g., ?board_no=2)
            const regex = new RegExp("[\\?&]board_no=([^&#]*)");
            const results = regex.exec(location.search);
            if (results !== null) {
                return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
            // 2. Try parsing from pathname (e.g., /board/납품사례/2/ or /skin-skin110/board/2/)
            const pathParts = window.location.pathname.split('/').filter(Boolean);
            const boardIdx = pathParts.indexOf('board');
            if (boardIdx !== -1) {
                for (let i = pathParts.length - 1; i > boardIdx; i--) {
                    if (/^\d+$/.test(pathParts[i])) {
                        return pathParts[i];
                    }
                }
            }
            return "";
        };
        
        const isBoardPage = window.location.pathname.includes('/board/');
        const boardNo = getBoardNo();
        const shouldRenderPortfolio = !isBoardPage || boardNo === '2';

        if (shouldRenderPortfolio) {
            document.documentElement.classList.add('machuda-portfolio-active');
            // NOTE: tabs and grid are shown AFTER cards are rendered (deferred below)

            // Check if current page is the homepage or main page
            const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '/main.html' || !isBoardPage;
            
            // Parse the Cafe24 board data rows.
            // - Board list page (list.html): uses #machuda-raw-board-wrap li
            // - Homepage: uses #machuda-raw-data-table tr.machuda-raw-row
            const liRows = document.querySelectorAll('#machuda-raw-board-wrap li');
            const trRows = document.querySelectorAll('#machuda-raw-data-table tr.machuda-raw-row');
            const rows = liRows.length > 0 ? liRows : trRows;
            dynamicGrid.innerHTML = ''; // Clear empty grid
            let visibleCount = 0;

        rows.forEach(row => {
            // descBlock: 게시판 목록(list.html)은 .description div,
            //            홈페이지 테이블은 tr 자체에 data-* 속성이 있음
            const descBlock = row.querySelector('.description') || row;
            const hasData = descBlock.getAttribute('data-subject') || row.querySelector('.machuda-json-data');
            if (!hasData) return; // 유효한 게시글 행이 아니면 스킵

            // Parse JSON block if exists (Cafe24 real board content fallback)
            let jsonData = {};
            const jsonBlock = row.querySelector('.machuda-json-data');
            if (jsonBlock) {
                try {
                    jsonData = JSON.parse(jsonBlock.textContent);
                } catch(e) {
                    console.error("JSON parsing error:", e);
                }
            }

            const prodId = jsonData.prodId || descBlock.getAttribute('data-prod-id') || 'tee30';
            const prodName = jsonData.prodName || descBlock.getAttribute('data-prod-name') || descBlock.getAttribute('data-subject') || '커스텀 단체복';
            const fabric = jsonData.fabric || descBlock.getAttribute('data-fabric') || '상세설명 참조';
            const printDesc = jsonData.printDesc || descBlock.getAttribute('data-print-desc') || '상세설명 참조';
            
            const printFront = jsonData.printFront || descBlock.getAttribute('data-print-front') || 'none';
            const printFrontColors = jsonData.printFrontColors || descBlock.getAttribute('data-print-front-colors') || '';
            const printFrontSize = jsonData.printFrontSize || descBlock.getAttribute('data-print-front-size') || '';
            
            const printBack = jsonData.printBack || descBlock.getAttribute('data-print-back') || 'none';
            const printBackColors = jsonData.printBackColors || descBlock.getAttribute('data-print-back-colors') || '';
            const printBackSize = jsonData.printBackSize || descBlock.getAttribute('data-print-back-size') || '';
            
            const printSleeve = jsonData.printSleeve || descBlock.getAttribute('data-print-sleeve') || 'none';
            const printSleeveColors = jsonData.printSleeveColors || descBlock.getAttribute('data-print-sleeve-colors') || '';
            const printSleeveSize = jsonData.printSleeveSize || descBlock.getAttribute('data-print-sleeve-size') || '';

            const tip = jsonData.tip || descBlock.getAttribute('data-tip') || '제작 문의는 카카오톡 빠른 문의를 이용해 주세요.';
            
            // Map category defensively (convert Korean names to English filter keys)
            let category = jsonData.category || descBlock.getAttribute('data-category') || '';
            if (category) {
                category = category.trim();
                if (category.includes('회사') || category.includes('근무복')) {
                    category = 'company';
                } else if (category.includes('학교') || category.includes('반티')) {
                    category = 'school';
                } else if (category.includes('종교') || category.includes('가족') || category.includes('교회')) {
                    category = 'church';
                } else if (category.includes('동호회') || category.includes('굿즈')) {
                    category = 'sports';
                } else if (category.includes('가게') || category.includes('기타') || category.includes('찜질')) {
                    category = 'sauna';
                } else {
                    if (!['company', 'school', 'church', 'sports', 'sauna'].includes(category)) {
                        category = 'sauna';
                    }
                }
            } else {
                category = 'sauna';
            }

            let categoryKo = '가게/기타';
            if (category === 'company') categoryKo = '회사/근무복';
            else if (category === 'school') categoryKo = '학교/반티';
            else if (category === 'church') categoryKo = '종교/가족';
            else if (category === 'sports') categoryKo = '동호회/굿즈';
            else if (category === 'sauna') categoryKo = '가게/기타';

            // Extract default tags if empty
            let tagsAttr = jsonData.tags || descBlock.getAttribute('data-tags') || '';
            if (!tagsAttr) {
                if (category === 'company') tagsAttr = '#회사유니폼,#근무복,#단체복';
                else if (category === 'school') tagsAttr = '#학교반티,#체육대회,#반티';
                else if (category === 'church') tagsAttr = '#교회티,#가족티,#단체티';
                else if (category === 'sports') tagsAttr = '#동호회티,#굿즈티,#단체티';
                else tagsAttr = '#단체티,#주문제작';
            }

            // Defensively check image and skip Cafe24 system icons (e.g. paperclips, lock icons)
            const isValidPortfolioImage = (src) => {
                if (!src) return false;
                const lower = src.toLowerCase();
                if (lower.includes('ico_') || lower.includes('icon_') || lower.includes('clear.gif') || lower.includes('spacer') || lower.includes('attachment') || lower.includes('btn_') || lower.includes('re.gif') || lower.includes('198x198')) {
                    return false;
                }
                if (lower.endsWith('.gif') && (lower.includes('lock') || lower.includes('new') || lower.includes('hot') || lower.includes('reply'))) {
                    return false;
                }
                return true;
            };

            let image = jsonData.image || descBlock.getAttribute('data-image') || '';
            if (!isValidPortfolioImage(image)) {
                // Find a valid img element inside this row
                const imgs = row.querySelectorAll('img');
                image = '';
                for (const img of imgs) {
                    if (isValidPortfolioImage(img.src)) {
                        image = img.src;
                        break;
                    }
                }
            }
            if (!image) {
                // Default high quality fallback mockup image
                image = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
            }

            // Create card wrapper
            const card = document.createElement('div');
            card.className = 'machuda-portfolio-card';
            card.setAttribute('data-category', category);
            card.setAttribute('data-prod-id', prodId);
            card.setAttribute('data-prod-name', prodName);
            card.setAttribute('data-fabric', fabric);
            card.setAttribute('data-print-desc', printDesc);
            card.setAttribute('data-print-front', printFront);
            if (printFrontColors) card.setAttribute('data-print-front-colors', printFrontColors);
            if (printFrontSize) card.setAttribute('data-print-front-size', printFrontSize);
            card.setAttribute('data-print-back', printBack);
            if (printBackColors) card.setAttribute('data-print-back-colors', printBackColors);
            if (printBackSize) card.setAttribute('data-print-back-size', printBackSize);
            card.setAttribute('data-print-sleeve', printSleeve);
            if (printSleeveColors) card.setAttribute('data-print-sleeve-colors', printSleeveColors);
            if (printSleeveSize) card.setAttribute('data-print-sleeve-size', printSleeveSize);
            card.setAttribute('data-tip', tip);
            
            // Build tag HTML
            const tags = tagsAttr.split(',').filter(t => t.trim().length > 0);
            let tagsHtml = '';
            tags.forEach((tag, idx) => {
                const badgeClass = idx < 2 ? 'yellow' : 'outline';
                tagsHtml += `<span class="machuda-p-tag ${badgeClass}">${tag}</span>\n`;
            });

            card.innerHTML = `
                <div class="machuda-card-image-wrap">
                    <img src="${image}" alt="${prodName}">
                    <div class="machuda-card-overlay">
                        <div class="machuda-card-tags">
                            ${tagsHtml}
                        </div>
                    </div>
                </div>
                <div class="machuda-card-info">
                    <h4>${prodName}</h4>
                    <p>${categoryKo}</p>
                </div>
            `;
            
            // 게시글 상세 URL 추출 (a.imgLink 또는 a[href*="/article/"])
            const linkEl = row.querySelector('a.imgLink') || row.querySelector('a[href*="/article/"]') || row.querySelector('a[href*="/board/"]');
            const detailUrl = linkEl ? (linkEl.getAttribute('href') || '') : '';
            if (detailUrl) card.setAttribute('data-link', detailUrl);

            // 클릭 시: 견적기 모달 열기 (모달 안에 본문 링크 있음)
            card.addEventListener('click', () => {
                openPortfolioDetail(card);
            });
            card.style.cursor = 'pointer';

            // Show only the first 5 cards on homepage (1 row), otherwise show all on list page
            const maxVisible = isHomepage ? 10 : 9999;
            if (visibleCount < maxVisible) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }

            dynamicGrid.appendChild(card);
        });

        // ── 카드 렌더링 완료 후에만 탭/그리드를 표시 ──────────────────
        const dynamicTabsContainer = document.getElementById('machuda-dynamic-tabs');
        if (visibleCount > 0) {
            if (dynamicTabsContainer) {
                dynamicTabsContainer.style.setProperty('display', 'flex', 'important');
            }
            if (dynamicGrid) {
                dynamicGrid.style.setProperty('display', 'grid', 'important');
            }
        } else if (isHomepage) {
            // 홈페이지에서 trRows가 비어 있을 때 → AJAX 폴백으로 Board 2 직접 fetch
            console.log('[Machuda] trRows empty on homepage, falling back to AJAX fetch');
            fetch('/board/gallery/list.html?board_no=2', { credentials: 'same-origin' })
                .then(function(r) { return r.text(); })
                .then(function(fetchedHtml) {
                    const p = new DOMParser();
                    const doc = p.parseFromString(fetchedHtml, 'text/html');
                    const fetchedRows = doc.querySelectorAll('#machuda-raw-board-wrap li');
                    let ajaxCount = 0;
                    fetchedRows.forEach(function(frow) {
                        const db = frow.querySelector('.description') || frow;
                        if (!db.getAttribute('data-subject')) return;
                        const subj = db.getAttribute('data-subject') || '커스텀 단체복';
                        let cat = db.getAttribute('data-category') || '';
                        const img = db.getAttribute('data-image') || '';
                        let catKey = 'sauna';
                        if (cat.includes('회사') || cat.includes('근무복')) catKey = 'company';
                        else if (cat.includes('학교') || cat.includes('반티') || cat.includes('과') || cat.includes('대학')) catKey = 'school';
                        else if (cat.includes('교회') || cat.includes('종교') || cat.includes('가족') || cat.includes('성당')) catKey = 'church';
                        else if (cat.includes('동호회') || cat.includes('굿즈')) catKey = 'sports';
                        const catKoMap = { company:'회사/근무복', school:'학교/반티', church:'종교/가족', sports:'동호회/굿즈', sauna:'가게/기타' };
                        const catKo = catKoMap[catKey];
                        const isValidImg = (src) => src && !src.toLowerCase().includes('ico_') && !src.toLowerCase().includes('198x198') && !src.toLowerCase().includes('clear.gif');
                        const finalImg = isValidImg(img) ? img : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
                        const c = document.createElement('div');
                        c.className = 'machuda-portfolio-card';
                        c.setAttribute('data-category', catKey);
                        c.setAttribute('data-prod-name', subj);
                        c.setAttribute('data-fabric', db.getAttribute('data-fabric') || '상세설명 참조');
                        c.setAttribute('data-print-desc', db.getAttribute('data-print-desc') || '상세설명 참조');
                        c.setAttribute('data-print-front', db.getAttribute('data-print-front') || 'none');
                        c.setAttribute('data-print-back', db.getAttribute('data-print-back') || 'none');
                        c.setAttribute('data-print-sleeve', db.getAttribute('data-print-sleeve') || 'none');
                        c.setAttribute('data-tip', '제작 문의는 카카오톡 빠른 문의를 이용해 주세요.');
                        c.innerHTML = '<div class="machuda-card-image-wrap"><img src="' + finalImg + '" alt="' + subj + '" loading="lazy"><div class="machuda-card-overlay"><div class="machuda-card-tags"><span class="machuda-p-tag yellow">' + catKo + '</span></div></div></div><div class="machuda-card-info"><h4>' + subj + '</h4><p>' + catKo + '</p></div>';
                        c.style.cursor = 'pointer';
                        c.addEventListener('click', function() { openPortfolioDetail(c); });
                        if (ajaxCount < 5) { c.style.display = 'flex'; ajaxCount++; }
                        else c.style.display = 'none';
                        dynamicGrid.appendChild(c);
                    });
                    if (ajaxCount > 0) {
                        dynamicGrid.style.setProperty('display', 'grid', 'important');
                        if (dynamicTabsContainer) dynamicTabsContainer.style.setProperty('display', 'flex', 'important');
                    }
                })
                .catch(function(e) { console.warn('[Machuda] AJAX fallback failed:', e); });
        }
        // ──────────────────────────────────────────────────────────────

        // Hide original Cafe24 raw table wrapper
        const rawWrap = document.getElementById('machuda-raw-board-wrap');
        if (rawWrap) {
            rawWrap.style.setProperty('display', 'none', 'important');
        }
        // Force hide all duplicated raw data tables and their parent table modules defensively
        const rawTables = document.querySelectorAll('#machuda-raw-data-table');
        rawTables.forEach(tbl => {
            tbl.style.setProperty('display', 'none', 'important');
            const parentTable = tbl.closest('table');
            if (parentTable) {
                parentTable.style.setProperty('display', 'none', 'important');
            }
            const parentModule = tbl.closest('[module^="board_list"]');
            if (parentModule) {
                parentModule.style.setProperty('display', 'none', 'important');
            }
        });

        // Bind click events on dynamic portfolio tabs
        const dynamicTabs = document.querySelectorAll('#machuda-dynamic-tabs .machuda-tab-btn');
        dynamicTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                dynamicTabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                const portfolioCards = dynamicGrid.querySelectorAll('.machuda-portfolio-card');
                
                let visibleCount = 0;
                portfolioCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        const maxVisible = isHomepage ? 10 : 9999;
                        if (visibleCount < maxVisible) {
                            card.style.display = 'flex';
                            visibleCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        } else {
            // If it is another gallery board page, make sure the raw board wrap is visible
            // and hide our custom portfolio elements
            document.documentElement.classList.remove('machuda-portfolio-active');
            const rawWrap = document.getElementById('machuda-raw-board-wrap');
            if (rawWrap) {
                rawWrap.style.removeProperty('display'); // Let CSS handle it
            }
            const rawDataTable = document.getElementById('machuda-raw-data-table');
            if (rawDataTable) {
                // Use 'flex' so our CSS flex grid layout for photo-review works
                rawDataTable.style.setProperty('display', 'flex', 'important');
            }
            const dynamicTabsContainer = document.getElementById('machuda-dynamic-tabs');
            if (dynamicTabsContainer) {
                dynamicTabsContainer.style.setProperty('display', 'none', 'important');
            }
            if (dynamicGrid) {
                dynamicGrid.style.setProperty('display', 'none', 'important');
            }
            const portfolioSec = document.querySelector('.machuda-portfolio-section');
            if (portfolioSec) {
                portfolioSec.style.setProperty('display', 'none', 'important');
            }

            // 포토후기 (Board 4) - 팝업 없이 바로 본문 이동
            if (boardNo === '4') {
                const rawCards = document.querySelectorAll('#machuda-raw-data-table .gallery_list ul li');
                rawCards.forEach(li => {
                    const detailUrl = li.querySelector('a.imgLink') ? li.querySelector('a.imgLink').getAttribute('href') : '';
                    if (!detailUrl) return;

                    // li 카드 전체 클릭 시 본문으로 이동 (a 태그 클릭은 기본 동작 유지)
                    li.style.cursor = 'pointer';
                    li.addEventListener('click', (e) => {
                        // a 태그 클릭은 브라우저 기본 동작(링크 이동)에 맡김
                        if (e.target.closest('a')) return;
                        window.location.href = detailUrl;
                    });
                });
            }
        }

    } else {
        // ─────────────────────────────────────────────────────────────
        // 홈페이지 등 게시판 데이터가 없는 페이지:
        // Board 2(납품사례) 목록 페이지를 AJAX로 조용히 가져와서
        // 카드를 자동으로 파싱해 렌더링합니다.
        // 게시판에 글을 올리면 홈페이지에도 자동 반영됩니다.
        // ─────────────────────────────────────────────────────────────
        const ajaxDynamicGrid = document.getElementById('machuda-dynamic-grid');
        const ajaxDynamicTabs = document.getElementById('machuda-dynamic-tabs');

        if (ajaxDynamicGrid) {
            fetch('/board/gallery/list.html?board_no=2', { credentials: 'same-origin' })
                .then(function(res) {
                    if (!res.ok) throw new Error('fetch failed: ' + res.status);
                    return res.text();
                })
                .then(function(html) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const rows = doc.querySelectorAll('#machuda-raw-board-wrap li');

                    ajaxDynamicGrid.innerHTML = '';
                    let visibleCount = 0;
                    const MAX_ON_HOME = 10;

                    rows.forEach(function(row) {
                        const descBlock = row.querySelector('.description');
                        if (!descBlock) return;

                        const subject  = descBlock.getAttribute('data-subject') || '커스텀 단체복';
                        let   category = descBlock.getAttribute('data-category') || '';
                        const imgSrc   = descBlock.getAttribute('data-image') || '';

                        let catKey = 'sauna';
                        if (category.includes('회사') || category.includes('근무복')) catKey = 'company';
                        else if (category.includes('학교') || category.includes('반티') || category.includes('과') || category.includes('대학')) catKey = 'school';
                        else if (category.includes('종교') || category.includes('가족') || category.includes('교회') || category.includes('성당')) catKey = 'church';
                        else if (category.includes('동호회') || category.includes('굿즈') || category.includes('스포츠')) catKey = 'sports';

                        const catKoMap = { company:'회사/근무복', school:'학교/반티', church:'종교/가족', sports:'동호회/굿즈', sauna:'가게/기타' };
                        const catKo = catKoMap[catKey] || category;

                        const isValid = (src) => {
                            if (!src) return false;
                            const l = src.toLowerCase();
                            return !l.includes('ico_') && !l.includes('icon_') && !l.includes('198x198') && !l.includes('clear.gif') && !l.includes('spacer');
                        };

                        const image = isValid(imgSrc) ? imgSrc : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';

                        const card = document.createElement('div');
                        card.className = 'machuda-portfolio-card';
                        card.setAttribute('data-category', catKey);
                        card.setAttribute('data-prod-name', subject);
                        card.setAttribute('data-fabric', descBlock.getAttribute('data-fabric') || '상세설명 참조');
                        card.setAttribute('data-print-desc', descBlock.getAttribute('data-print-desc') || '상세설명 참조');
                        card.setAttribute('data-print-front', descBlock.getAttribute('data-print-front') || 'none');
                        card.setAttribute('data-print-back', descBlock.getAttribute('data-print-back') || 'none');
                        card.setAttribute('data-print-sleeve', descBlock.getAttribute('data-print-sleeve') || 'none');
                        card.setAttribute('data-tip', '제작 문의는 카카오톡 빠른 문의를 이용해 주세요.');

                        card.innerHTML = '<div class="machuda-card-image-wrap"><img src="' + image + '" alt="' + subject + '" loading="lazy"><div class="machuda-card-overlay"><div class="machuda-card-tags"><span class="machuda-p-tag yellow">' + catKo + '</span></div></div></div><div class="machuda-card-info"><h4>' + subject + '</h4><p>' + catKo + '</p></div>';

                        card.style.cursor = 'pointer';
                        card.addEventListener('click', function() { openPortfolioDetail(card); });

                        if (visibleCount < MAX_ON_HOME) {
                            card.style.display = 'flex';
                            visibleCount++;
                        } else {
                            card.style.display = 'none';
                        }

                        ajaxDynamicGrid.appendChild(card);
                    });

                    if (visibleCount > 0) {
                        ajaxDynamicGrid.style.setProperty('display', 'grid', 'important');
                        if (ajaxDynamicTabs) {
                            ajaxDynamicTabs.style.setProperty('display', 'flex', 'important');
                        }
                        // 탭 필터 이벤트 바인딩
                        const tabBtns = document.querySelectorAll('#machuda-dynamic-tabs .machuda-tab-btn');
                        tabBtns.forEach(function(btn) {
                            btn.addEventListener('click', function() {
                                tabBtns.forEach(b => b.classList.remove('active'));
                                btn.classList.add('active');
                                const filter = btn.getAttribute('data-filter');
                                let shown = 0;
                                document.querySelectorAll('#machuda-dynamic-grid .machuda-portfolio-card').forEach(function(c) {
                                    const match = filter === 'all' || c.getAttribute('data-category') === filter;
                                    if (match && shown < MAX_ON_HOME) {
                                        c.style.display = 'flex'; shown++;
                                    } else {
                                        c.style.display = 'none';
                                    }
                                });
                            });
                        });
                    }
                })
                .catch(function(err) {
                    console.warn('[Machuda] 홈페이지 포트폴리오 로딩 실패:', err);
                });
        }
    }

    if (portfolioCloseBtn) {
        portfolioCloseBtn.addEventListener('click', closePortfolioModal);
    }
    if (portfolioModal) {
        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) {
                closePortfolioModal();
            }
        });
    }

    if (btnApplyQuote) {
        btnApplyQuote.addEventListener('click', () => {
            if (!activePortfolioCard) return;

            const prodId = activePortfolioCard.getAttribute('data-prod-id');
            const matchedProduct = PRODUCT_DATABASE.find(p => p.id === prodId);

            if (matchedProduct) {
                selectProduct(matchedProduct);
            }

            // Map print attributes to calculator UI state
            const printZones = ['front', 'back', 'sleeve'];
            printZones.forEach(zone => {
                const methodAttr = activePortfolioCard.getAttribute(`data-print-${zone}`);
                const el = zoneElements[zone];
                
                if (!methodAttr || methodAttr === 'none') {
                    el.toggle.checked = false;
                    el.body.classList.remove('active');
                    el.badge.classList.remove('active');
                    el.badge.textContent = '미선택';
                } else {
                    el.toggle.checked = true;
                    el.body.classList.add('active');
                    el.badge.classList.add('active');
                    el.badge.textContent = '선택됨';
                    
                    el.method.value = methodAttr;
                    
                    const colorsAttr = activePortfolioCard.getAttribute(`data-print-${zone}-colors`);
                    const sizeAttr = activePortfolioCard.getAttribute(`data-print-${zone}-size`);
                    
                    if (colorsAttr && el.colors) {
                        el.colors.value = colorsAttr;
                    }
                    if (sizeAttr && el.size) {
                        el.size.value = sizeAttr;
                    }

                    if (methodAttr === 'screen' || methodAttr === 'flock' || methodAttr === 'transfer') {
                        el.colorsGroup.style.display = 'block';
                        el.warning.style.display = 'none';
                        el.size.parentElement.style.display = 'flex';
                    } else if (methodAttr === 'silk') {
                        el.colorsGroup.style.display = 'none';
                        el.warning.style.display = 'none';
                        el.size.parentElement.style.display = 'flex';
                        if (el.colors) el.colors.value = "1";
                    } else { // embroidery (inquiry-only)
                        el.colorsGroup.style.display = 'none';
                        el.warning.style.display = 'block';
                        el.size.parentElement.style.display = 'none';
                    }
                }
            });

            closePortfolioModal();

            // Open the calculator modal
            setTimeout(() => {
                calculatorModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                calculateQuote();
            }, 300);
        });
    }

    } // end if (!isWriteOrModifyPage)

    // Initialize the Admin Custom Write Form if on Cafe24 write/modify page
    integrateBoardWriteForm();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMachudaCalculator);
} else {
    initMachudaCalculator();
}

// --- Cafe24 Board Write/Modify Page Custom Form Integration ---
const integrateBoardWriteForm = () => {
    // [마추다 보호] board_no=2 (납품사례)에서만 실행 — 견적서(5), 주문서(1002) 등 타 게시판 절대 간섭 안 함
    const urlParams = new URLSearchParams(window.location.search);
    const boardNo = urlParams.get('board_no') || '';
    if (boardNo !== '2') return;

    // Detect write form or content textarea
    const contentTextarea = document.getElementById('content') || document.querySelector('textarea[name="content"]');
    if (!contentTextarea) return;

    // Check if we are inside a write/modify page
    const isWritePage = window.location.pathname.includes('/write.html') || 
                        window.location.pathname.includes('/modify.html') ||
                        document.getElementById('boardWriteForm') ||
                        document.querySelector('form[name="boardWriteForm"]') ||
                        document.querySelector('form[action*="board_write"]');
    
    if (!isWritePage) return;

    // Prevent duplicate injection
    if (document.getElementById('machuda-admin-write-form')) return;

    // PRODUCT DATABASE referenced locally
    const PRODUCTS = [
        { id: 'tee30', name: '30수 라운드 반팔티', price: 8300 },
        { id: 'tee20', name: '20수 라운드 반팔티', price: 9500 },
        { id: 'polo_dry', name: '[톰스] 드라이 폴로 카라티', price: 10600 },
        { id: 'polo_tc', name: '[톰스] T/C 폴로셔츠', price: 12300 },
        { id: 'hoodie_heavy', name: '[이지와이] 레브 헤비쭈리 후드티', price: 30500 },
        { id: 'mtm_heavy', name: '[이지와이] 레브 헤비쭈리 맨투맨', price: 24200 },
        { id: 'zip_heavy', name: '[이지와이] 레브 헤비쭈리 후드집업', price: 36400 },
        { id: 'toms_zip', name: '[톰스] 헤비 쮸리 후드 집업 00189-NNZ', price: 31900 },
        { id: 'varsity_classic', name: '마추다 프리미엄 야구점퍼 (과잠)', price: 44000 },
        { id: 'windbreaker_staff', name: '마추다 프리미엄 스태프 바람막이', price: 28000 },
        { id: 'staff_tee', name: '스탭티 20수 (행사용)', price: 11800 },
        { id: 'staff_hoodie', name: '스탭 후드티 (행사용)', price: 20000 },
        { id: 'vest_taslan', name: '타스란 도우미 조끼', price: 9000 },
        { id: 'vest_security', name: '방범 조끼 s510', price: 20300 },
        { id: 'vest_office', name: '오피스 조끼 LD69', price: 18700 },
        { id: 'sauna_basic', name: '기본형 베스트 찜질복 세트', price: 20600 },
        { id: 'sauna_ynack', name: '고급형 와이넥 찜질복 세트', price: 22200 },
        { id: 'family_love', name: '사랑하는 한가족 패밀리룩티', price: 14900 },
        { id: 'ecobag_custom', name: '마추다 추천 에코백', price: 4000 }
    ];

    // Extract existing JSON if modifying
    let existingData = {};
    const rawText = contentTextarea.value || '';
    const jsonMatch = rawText.match(/<div class="machuda-json-data"[^>]*>([\s\S]*?)<\/div>/);
    if (jsonMatch && jsonMatch[1]) {
        try {
            existingData = JSON.parse(jsonMatch[1].trim());
        } catch(e) {
            console.error("Failed to parse existing JSON:", e);
        }
    }

    // Clean initial textarea content from the JSON block to keep editor clean
    if (jsonMatch) {
        contentTextarea.value = rawText.replace(jsonMatch[0], '').trim();
    }

    // Build Product Options HTML
    let prodOptions = '<option value="">-- 매칭 상품 선택 --</option>';
    PRODUCTS.forEach(p => {
        const selected = existingData.prodId === p.id ? 'selected' : '';
        prodOptions += `<option value="${p.id}" ${selected}>${p.name} (${p.price.toLocaleString('ko-KR')}원)</option>`;
    });

    // CSS styles for admin form
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        #machuda-admin-write-form {
            background: #fffcf0;
            border: 2px solid #ffd300;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            font-family: 'Noto Sans KR', sans-serif;
            color: #111;
        }
        #machuda-admin-write-form h3 {
            font-size: 15px;
            margin-top: 0;
            margin-bottom: 15px;
            color: #111;
            border-left: 4px solid #ffd300;
            padding-left: 8px;
            font-weight: 700;
        }
        .machuda-form-row {
            display: flex;
            margin-bottom: 12px;
            align-items: center;
        }
        .machuda-form-row label {
            width: 120px;
            font-size: 13px;
            font-weight: bold;
            color: #333;
        }
        .machuda-form-row input[type="text"], 
        .machuda-form-row select, 
        .machuda-form-row textarea {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 13px;
            outline: none;
        }
        .machuda-form-row input[type="text"]:focus, 
        .machuda-form-row select:focus, 
        .machuda-form-row textarea:focus {
            border-color: #ffd300;
        }
        .machuda-print-options {
            display: flex;
            gap: 15px;
            flex: 1;
            flex-wrap: wrap;
        }
        .machuda-print-zone-group {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            background: #fff;
            flex: 1;
            min-width: 180px;
        }
        .machuda-print-zone-group h4 {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #555;
            font-weight: bold;
        }
        .machuda-print-zone-group select {
            width: 100%;
            margin-bottom: 6px;
            padding: 4px;
            font-size: 11px;
        }
    `;
    document.head.appendChild(styleEl);

    // Build Custom Form HTML
    const formDiv = document.createElement('div');
    formDiv.id = 'machuda-admin-write-form';
    formDiv.innerHTML = `
        <h3>🏷️ 마추다 포트폴리오 스펙 입력란 (메인/갤러리 자동 연동)</h3>
        
        <div class="machuda-form-row">
            <label>의류 종류</label>
            <select id="mw-prod-id">${prodOptions}</select>
        </div>
        
        <div class="machuda-form-row">
            <label>원단 사양</label>
            <input type="text" id="mw-fabric" placeholder="예: 코마사 20수 면 100% / 특기사항" value="${existingData.fabric || ''}">
        </div>
        
        <div class="machuda-form-row">
            <label>인쇄 방식 설명</label>
            <input type="text" id="mw-print-desc" placeholder="예: 전면 졸나염 2도 / 후면 컴퓨터자수" value="${existingData.printDesc || ''}">
        </div>
        
        <div class="machuda-form-row">
            <label>해시태그</label>
            <input type="text" id="mw-tags" placeholder="예: #회사유니폼,#컴퓨터자수 (쉼표로 구분, 최대 4개 권장)" value="${existingData.tags || ''}">
        </div>
        
        <div class="machuda-form-row">
            <label>대표 이미지 주소</label>
            <input type="text" id="mw-image" placeholder="예: https://images.unsplash.com/... (첨부파일 1의 주소 또는 외부 주소)" value="${existingData.image || ''}">
        </div>
        
        <div class="machuda-form-row">
            <label>제작 가이드 팁</label>
            <textarea id="mw-tip" rows="3" placeholder="소재 특징이나 세탁 유의사항, 로고 난이도 팁 등을 적어주세요.">${existingData.tip || ''}</textarea>
        </div>
        
        <div class="machuda-form-row" style="align-items: flex-start;">
            <label>견적 매핑 옵션</label>
            <div class="machuda-print-options">
                <!-- Front -->
                <div class="machuda-print-zone-group">
                    <h4>앞면(전면) 인쇄</h4>
                    <select id="mw-print-front">
                        <option value="none" ${existingData.printFront === 'none' ? 'selected' : ''}>없음</option>
                        <option value="screen" ${existingData.printFront === 'screen' ? 'selected' : ''}>졸나염</option>
                        <option value="silk" ${existingData.printFront === 'silk' ? 'selected' : ''}>실크/발포/금은박</option>
                        <option value="flock" ${existingData.printFront === 'flock' ? 'selected' : ''}>후로피</option>
                        <option value="transfer" ${existingData.printFront === 'transfer' ? 'selected' : ''}>실사/우레탄</option>
                        <option value="embroidery" ${existingData.printFront === 'embroidery' ? 'selected' : ''}>컴퓨터자수</option>
                    </select>
                    <select id="mw-print-front-colors">
                        <option value="1" ${existingData.printFrontColors == '1' ? 'selected' : ''}>1도</option>
                        <option value="2" ${existingData.printFrontColors == '2' ? 'selected' : ''}>2도</option>
                        <option value="3" ${existingData.printFrontColors == '3' ? 'selected' : ''}>3도 이상</option>
                    </select>
                    <select id="mw-print-front-size">
                        <option value="small" ${existingData.printFrontSize === 'small' ? 'selected' : ''}>소형</option>
                        <option value="large" ${existingData.printFrontSize === 'large' ? 'selected' : ''}>대형</option>
                        <option value="huge" ${existingData.printFrontSize === 'huge' ? 'selected' : ''}>특대형</option>
                    </select>
                </div>
                
                <!-- Back -->
                <div class="machuda-print-zone-group">
                    <h4>뒷면(후면) 인쇄</h4>
                    <select id="mw-print-back">
                        <option value="none" ${existingData.printBack === 'none' ? 'selected' : ''}>없음</option>
                        <option value="screen" ${existingData.printBack === 'screen' ? 'selected' : ''}>졸나염</option>
                        <option value="silk" ${existingData.printBack === 'silk' ? 'selected' : ''}>실크/발포/금은박</option>
                        <option value="flock" ${existingData.printBack === 'flock' ? 'selected' : ''}>후로피</option>
                        <option value="transfer" ${existingData.printBack === 'transfer' ? 'selected' : ''}>실사/우레탄</option>
                        <option value="embroidery" ${existingData.printBack === 'embroidery' ? 'selected' : ''}>컴퓨터자수</option>
                    </select>
                    <select id="mw-print-back-colors">
                        <option value="1" ${existingData.printBackColors == '1' ? 'selected' : ''}>1도</option>
                        <option value="2" ${existingData.printBackColors == '2' ? 'selected' : ''}>2도</option>
                        <option value="3" ${existingData.printBackColors == '3' ? 'selected' : ''}>3도 이상</option>
                    </select>
                    <select id="mw-print-back-size">
                        <option value="small" ${existingData.printBackSize === 'small' ? 'selected' : ''}>소형</option>
                        <option value="large" ${existingData.printBackSize === 'large' ? 'selected' : ''}>대형</option>
                        <option value="huge" ${existingData.printBackSize === 'huge' ? 'selected' : ''}>특대형</option>
                    </select>
                </div>
                
                <!-- Sleeve -->
                <div class="machuda-print-zone-group">
                    <h4>소매 인쇄</h4>
                    <select id="mw-print-sleeve">
                        <option value="none" ${existingData.printSleeve === 'none' ? 'selected' : ''}>없음</option>
                        <option value="screen" ${existingData.printSleeve === 'screen' ? 'selected' : ''}>졸나염</option>
                        <option value="silk" ${existingData.printSleeve === 'silk' ? 'selected' : ''}>실크/발포/금은박</option>
                        <option value="flock" ${existingData.printSleeve === 'flock' ? 'selected' : ''}>후로피</option>
                        <option value="transfer" ${existingData.printSleeve === 'transfer' ? 'selected' : ''}>실사/우레탄</option>
                        <option value="embroidery" ${existingData.printSleeve === 'embroidery' ? 'selected' : ''}>컴퓨터자수</option>
                    </select>
                    <select id="mw-print-sleeve-colors">
                        <option value="1" ${existingData.printSleeveColors == '1' ? 'selected' : ''}>1도</option>
                        <option value="2" ${existingData.printSleeveColors == '2' ? 'selected' : ''}>2도</option>
                        <option value="3" ${existingData.printSleeveColors == '3' ? 'selected' : ''}>3도 이상</option>
                    </select>
                    <select id="mw-print-sleeve-size">
                        <option value="small" ${existingData.printSleeveSize === 'small' ? 'selected' : ''}>소형</option>
                        <option value="large" ${existingData.printSleeveSize === 'large' ? 'selected' : ''}>대형</option>
                        <option value="huge" ${existingData.printSleeveSize === 'huge' ? 'selected' : ''}>특대형</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    // Find parent form safely
    let parentForm = contentTextarea.closest('form');
    if (!parentForm) {
        parentForm = document.getElementById('boardWriteForm') || 
                     document.querySelector('form[name="boardWriteForm"]') || 
                     document.querySelector('form[action*="board_write"]') ||
                     document.querySelector('form[action*="board_modify"]');
    }

    // Inject form safely at the top of the form or before the textarea
    if (parentForm) {
        parentForm.insertBefore(formDiv, parentForm.firstChild);
    } else {
        contentTextarea.parentNode.insertBefore(formDiv, contentTextarea);
    }

    if (parentForm) {
        parentForm.addEventListener('submit', (e) => {
            // Force Cafe24 SmartEditor 2.0 contents to sync back to textarea before we read it
            if (typeof oEditors !== 'undefined' && oEditors.getById && oEditors.getById["content"]) {
                try {
                    oEditors.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);
                } catch(err) {
                    console.warn("[Machuda] SmartEditor sync failed:", err);
                }
            }

            const getVal = (id) => {
                const el = document.getElementById(id);
                return el ? el.value : '';
            };

            const prodId = getVal('mw-prod-id');
            const fabric = getVal('mw-fabric').trim();
            const printDesc = getVal('mw-print-desc').trim();
            const tags = getVal('mw-tags').trim();
            const image = getVal('mw-image').trim();
            const tip = getVal('mw-tip').trim();
            
            const printFront = getVal('mw-print-front') || 'none';
            const printFrontColors = getVal('mw-print-front-colors') || '1';
            const printFrontSize = getVal('mw-print-front-size') || 'small';
            
            const printBack = getVal('mw-print-back') || 'none';
            const printBackColors = getVal('mw-print-back-colors') || '1';
            const printBackSize = getVal('mw-print-back-size') || 'small';
            
            const printSleeve = getVal('mw-print-sleeve') || 'none';
            const printSleeveColors = getVal('mw-print-sleeve-colors') || '1';
            const printSleeveSize = getVal('mw-print-sleeve-size') || 'small';

            // Resolve Category defensively
            const cafe24CategorySelect = document.getElementById('category_no') || document.querySelector('select[name="category_no"]');
            let category = 'sauna';
            if (cafe24CategorySelect && cafe24CategorySelect.selectedIndex >= 0) {
                const selectedOpt = cafe24CategorySelect.options[cafe24CategorySelect.selectedIndex];
                if (selectedOpt) {
                    const text = selectedOpt.text || '';
                    if (text.includes('회사')) category = 'company';
                    else if (text.includes('학교') || text.includes('반티')) category = 'school';
                    else if (text.includes('종교') || text.includes('가족') || text.includes('교회')) category = 'church';
                    else if (text.includes('동호회') || text.includes('굿즈')) category = 'sports';
                    else if (text.includes('가게') || text.includes('기타') || text.includes('찜질')) category = 'sauna';
                }
            }

            let finalImage = image;
            if (!finalImage) {
                finalImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
            }

            // Get subject value defensively
            const subjectEl = document.querySelector('input[name="subject"]') || document.getElementById('subject');
            const subjectVal = subjectEl ? subjectEl.value : '';

            const data = {
                prodId: prodId,
                prodName: subjectVal,
                category: category,
                fabric: fabric,
                printDesc: printDesc,
                printFront: printFront,
                printFrontColors: printFrontColors,
                printFrontSize: printFrontSize,
                printBack: printBack,
                printBackColors: printBackColors,
                printBackSize: printBackSize,
                printSleeve: printSleeve,
                printSleeveColors: printSleeveColors,
                printSleeveSize: printSleeveSize,
                tip: tip,
                tags: tags,
                image: finalImage
            };

            const cleanBody = contentTextarea.value.replace(/<div class="machuda-json-data"[^>]*>([\s\S]*?)<\/div>/, '').trim();
            const jsonBlockHtml = `\n\n<div class="machuda-json-data" style="display:none !important;">${JSON.stringify(data, null, 2)}</div>`;
            
            // Set final textarea value
            contentTextarea.value = cleanBody + jsonBlockHtml;
        });
    }
};
