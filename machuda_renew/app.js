// Machuda Renewal Responsive Website Javascript Logic

// Local State variables
let currentStep = 1;
let selectedProductId = 'varsity';
let selectedSubOptionId = 'flat-emb';
let uploadedFiles = [];
let proofs = [];
let activeProofId = null;

// Initialize Page Logic
document.addEventListener('DOMContentLoaded', () => {
  // Check which page is currently loaded
  if (document.getElementById('product-selection-grid')) {
    initOrderFormPage();
  }
  if (document.getElementById('proof-sidebar-cards')) {
    initProofDashboardPage();
  }
});

/* --- A. SMART ORDER FORM PAGE LOGIC --- */
function initOrderFormPage() {
  // Pre-select product based on URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const prodParam = urlParams.get('prod');
  if (prodParam && ['varsity', 'hoodie', 'tshirt'].includes(prodParam)) {
    selectedProductId = prodParam;
  }

  renderProductGrid();

  // Next/Prev Buttons
  const btnNext = document.getElementById('btn-wizard-next');
  const btnPrev = document.getElementById('btn-wizard-prev');
  if (btnNext) btnNext.addEventListener('click', handleStepNext);
  if (btnPrev) btnPrev.addEventListener('click', handleStepPrev);

  // File Upload Handlers
  const dragZone = document.getElementById('drag-drop-zone');
  const fileInputHidden = document.getElementById('file-input-hidden');

  if (dragZone && fileInputHidden) {
    dragZone.addEventListener('click', () => fileInputHidden.click());
    fileInputHidden.addEventListener('change', (e) => handleFilesAdded(e.target.files));
    
    dragZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragZone.style.borderColor = 'hsl(var(--primary))';
      dragZone.style.background = 'hsl(var(--primary-glow))';
    });

    dragZone.addEventListener('dragleave', () => {
      dragZone.style.borderColor = 'hsl(var(--border-color))';
      dragZone.style.background = 'hsl(var(--bg-card) / 0.3)';
    });

    dragZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dragZone.style.borderColor = 'hsl(var(--border-color))';
      dragZone.style.background = 'hsl(var(--bg-card) / 0.3)';
      handleFilesAdded(e.dataTransfer.files);
    });
  }

  // Size quantity selectors triggers calculation
  const sizeInputs = document.querySelectorAll('.size-qty');
  sizeInputs.forEach(input => {
    input.addEventListener('input', () => {
      validateQuantities();
      updateQuoteCalculations();
    });
  });

  // Print dropdown updates sub-option list & calculations
  const printTypeSelect = document.getElementById('print-type');
  const printLocSelect = document.getElementById('print-location');

  if (printTypeSelect) {
    printTypeSelect.addEventListener('change', () => {
      togglePrintSubOptions();
      updateQuoteCalculations();
    });
  }
  if (printLocSelect) {
    printLocSelect.addEventListener('change', updateQuoteCalculations);
  }

  // Handle clicking on specific sub-options (e.g. 졸나염, 엠보나염)
  initSubOptionSelection();
  
  // Initial calculation
  togglePrintSubOptions();
  updateQuoteCalculations();
}

function renderProductGrid() {
  const container = document.getElementById('product-selection-grid');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(prod => `
    <div class="product-card ${prod.id === selectedProductId ? 'selected' : ''}" data-id="${prod.id}">
      <div class="product-image-container">
        <img src="${prod.image}" alt="${prod.name}">
      </div>
      <div class="product-title">${prod.name}</div>
      <div class="product-price">${prod.basePrice.toLocaleString()}원 <span style="font-size: 11px; font-weight: normal; color: hsl(var(--text-muted));">/ 기본단가</span></div>
      <div class="product-desc">${prod.description}</div>
    </div>
  `).join('');

  const cards = container.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedProductId = card.getAttribute('data-id');
      updateQuoteCalculations();
    });
  });
}

function togglePrintSubOptions() {
  const type = document.getElementById('print-type').value;
  
  // Hide all sub groups
  document.getElementById('sub-group-silkscreen').style.display = 'none';
  document.getElementById('sub-group-embroidery').style.display = 'none';
  document.getElementById('sub-group-transfer').style.display = 'none';

  // Show selected sub group & set default sub-option
  if (type === 'silkscreen') {
    document.getElementById('sub-group-silkscreen').style.display = 'block';
    selectedSubOptionId = 'plastisol';
  } else if (type === 'embroidery') {
    document.getElementById('sub-group-embroidery').style.display = 'block';
    selectedSubOptionId = 'flat-emb';
  } else if (type === 'transfer') {
    document.getElementById('sub-group-transfer').style.display = 'block';
    selectedSubOptionId = 'dft';
  }

  // reset sub selection active highlights
  document.querySelectorAll('.btn-select-sub').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-sub') === selectedSubOptionId) {
      btn.classList.add('active');
    }
  });
}

function initSubOptionSelection() {
  const container = document.getElementById('print-sub-options-area');
  if (!container) return;

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-select-sub')) {
      const parentGroup = e.target.closest('.sub-options-group');
      parentGroup.querySelectorAll('.btn-select-sub').forEach(b => b.classList.remove('active'));
      
      e.target.classList.add('active');
      selectedSubOptionId = e.target.getAttribute('data-sub');
      updateQuoteCalculations();
    }
  });
}

function handleStepNext() {
  if (currentStep === 1) {
    if (!selectedProductId) {
      alert('상품을 먼저 선택해 주세요.');
      return;
    }
    setStep(2);
  } else if (currentStep === 2) {
    const totalQty = getSelectedTotalQty();
    if (totalQty < 10) {
      alert('단체복 제작 최소 수량은 10장입니다. 사이즈별 수량을 더 입력해 주세요.');
      return;
    }
    setStep(3);
  } else if (currentStep === 3) {
    prepareOrderSummary();
    setStep(4);
  } else if (currentStep === 4) {
    submitFinalOrder();
  }
}

function handleStepPrev() {
  if (currentStep > 1) {
    setStep(currentStep - 1);
  }
}

function setStep(stepNum) {
  document.getElementById(`step-panel-${currentStep}`).classList.remove('active');
  document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.remove('active');

  if (stepNum > currentStep) {
    document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('completed');
  }

  currentStep = stepNum;
  document.getElementById(`step-panel-${currentStep}`).classList.add('active');
  document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');

  const btnNext = document.getElementById('btn-wizard-next');
  const btnPrev = document.getElementById('btn-wizard-prev');

  btnPrev.disabled = currentStep === 1;

  if (currentStep === 4) {
    btnNext.innerText = '최종 주문 접수';
  } else {
    btnNext.innerText = '다음 단계';
  }
}

function getSelectedTotalQty() {
  let sum = 0;
  document.querySelectorAll('.size-qty').forEach(input => {
    sum += parseInt(input.value) || 0;
  });
  return sum;
}

function validateQuantities() {
  const sum = getSelectedTotalQty();
  document.getElementById('total-qty-cell').innerText = `${sum}장`;
}

function updateQuoteCalculations() {
  const qty = getSelectedTotalQty();
  const product = PRODUCTS.find(p => p.id === selectedProductId);
  if (!product) return;

  const basePriceUnit = product.basePrice;
  
  // Volume discount logic
  let discountRate = 0;
  if (qty >= 100) discountRate = 0.15;
  else if (qty >= 50) discountRate = 0.10;
  else if (qty >= 30) discountRate = 0.05;

  const printLoc = document.getElementById('print-location').value;
  const printType = document.getElementById('print-type').value;

  let printChargeUnit = 0;
  if (printLoc === 'multi') printChargeUnit = 6000;
  else if (printLoc === 'front' || printLoc === 'back') printChargeUnit = 4000;
  else printChargeUnit = 2500;

  // Add print sub-option additions
  if (selectedSubOptionId === 'emboss') printChargeUnit += 1500;
  else if (selectedSubOptionId === 'double') printChargeUnit += 2000;
  else if (selectedSubOptionId === 'applique') printChargeUnit += 2500;
  else if (selectedSubOptionId === 'flat-emb') printChargeUnit += 1000;
  
  const discountedProductPrice = basePriceUnit * (1 - discountRate);
  const totalUnitCost = discountedProductPrice + printChargeUnit;
  const totalSum = totalUnitCost * qty;

  // Update UI Elements
  document.getElementById('price-base-unit').innerText = `${basePriceUnit.toLocaleString()} 원`;
  document.getElementById('price-discount-rate').innerText = `${Math.round(discountRate * 100)}%`;
  document.getElementById('price-print-charge').innerText = `+ ${(printChargeUnit * qty).toLocaleString()} 원 (${printChargeUnit.toLocaleString()}원/장)`;
  document.getElementById('price-total-sum').innerText = `${totalSum.toLocaleString()} 원`;
}

function handleFilesAdded(files) {
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    
    // Cafe24 10MB limit warning check
    if (f.size > 10 * 1024 * 1024) {
      alert(`[용량 제한 안내]\n\n'${f.name}' 파일(${(f.size / (1024 * 1024)).toFixed(2)}MB)은 10MB 한도를 초과합니다.\n\n카페24 쇼핑몰 업로드 용량 한도 준수를 위해 10MB 이하의 이미지 파일만 여기에 올려주세요.\n10MB가 초과하는 원본 자수/인쇄 도안(AI, PSD 등)은 주문 접수 후 contact@machuda.com 메일로 보내주시기 바랍니다.`);
      continue;
    }

    uploadedFiles.push({
      id: `file-${Date.now()}-${i}`,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB'
    });
  }
  renderFilePreview();
}

function renderFilePreview() {
  const container = document.getElementById('uploaded-files-container');
  if (!container) return;

  if (uploadedFiles.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = uploadedFiles.map(file => `
    <div class="file-preview-item">
      <div>
        <span style="font-weight:600; color:hsl(var(--primary)); margin-right:8px;">📁</span>
        <span style="font-size:14px;">${file.name}</span>
        <span style="font-size:12px; color:hsl(var(--text-muted)); margin-left:8px;">(${file.size})</span>
      </div>
      <button class="file-remove-btn" onclick="removeFile('${file.id}')">삭제</button>
    </div>
  `).join('');
}

window.removeFile = function(fileId) {
  uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
  renderFilePreview();
};

// Texture example popup modal (Figma spec: previewing fabric details)
window.showTextureExample = function(type) {
  const modal = document.getElementById('texture-modal');
  const img = document.getElementById('modal-texture-img');
  const title = document.getElementById('modal-texture-title');
  const desc = document.getElementById('modal-texture-desc');

  if (type === 'embroidery') {
    title.innerText = '컴퓨터 직자수 실제 질감 예시';
    img.src = 'assets/embroidery_texture.jpg';
    desc.innerText = '원단에 고급 금사 실을 촘촘히 꿰매어 입체적이고 고급스럽게 표현한 자수 예시입니다. 실 풀림이 없고 튼튼하여 단체 패딩이나 야구점퍼 과잠에 강력 추천합니다.';
  } else {
    title.innerText = '더블나염/실크스크린 인쇄 예시';
    img.src = 'assets/print_texture.jpg';
    desc.innerText = '탄탄하게 코팅 처리된 나염 인쇄면의 텍스처 예시입니다. 여러 번 세탁해도 인쇄가 갈라지거나 떨어지지 않는 특수 가공을 거쳐 단체 티셔츠나 후드티에 널리 활용됩니다.';
  }

  modal.style.display = 'flex';
};

window.closeTextureExample = function() {
  document.getElementById('texture-modal').style.display = 'none';
};

function prepareOrderSummary() {
  const product = PRODUCTS.find(p => p.id === selectedProductId);
  document.getElementById('summary-product-name').innerText = product ? product.name : '-';

  const sizes = [];
  document.querySelectorAll('.size-qty').forEach(input => {
    const size = input.getAttribute('data-size');
    const val = parseInt(input.value) || 0;
    if (val > 0) {
      sizes.push(`${size}: ${val}장`);
    }
  });
  const totalQty = getSelectedTotalQty();
  document.getElementById('summary-qty-breakdown').innerText = `${sizes.join(', ')} (총합 ${totalQty}장)`;

  const printLocSelect = document.getElementById('print-location');
  const printTypeSelect = document.getElementById('print-type');
  const locLabel = printLocSelect.options[printLocSelect.selectedIndex].text;
  const typeLabel = printTypeSelect.options[printTypeSelect.selectedIndex].text;
  
  // Find name of active sub-option
  let subLabel = '';
  document.querySelectorAll('.btn-select-sub.active').forEach(btn => {
    const row = btn.closest('.sub-option-row');
    if (row) {
      subLabel = ` - ${row.querySelector('.sub-option-name').innerText}`;
    }
  });

  document.getElementById('summary-print-specs').innerText = `${locLabel} | ${typeLabel}${subLabel}`;

  if (uploadedFiles.length > 0) {
    document.getElementById('summary-file-name').innerText = uploadedFiles.map(f => f.name).join(', ');
  } else {
    document.getElementById('summary-file-name').innerText = '첨부된 파일 없음 (추후 이메일 발송)';
  }
}

function submitFinalOrder() {
  // Hide controls
  document.getElementById('wizard-control-footer').style.display = 'none';
  document.getElementById(`step-panel-${currentStep}`).style.display = 'none';
  document.querySelector('.wizard-steps').style.display = 'none';
  document.getElementById('order-success-panel').style.display = 'block';

  // Save the order to localStorage to bridge it to the Dashboard
  const product = PRODUCTS.find(p => p.id === selectedProductId);
  const totalQty = getSelectedTotalQty();
  const printLocSelect = document.getElementById('print-location');
  const printTypeSelect = document.getElementById('print-type');
  const locLabel = printLocSelect.options[printLocSelect.selectedIndex].text;
  const typeLabel = printTypeSelect.options[printTypeSelect.selectedIndex].text;

  const newOrder = {
    id: `proof-new-${Date.now()}`,
    title: `신규 리뉴얼 신청서 (${product.name})`,
    date: new Date().toISOString().split('T')[0],
    clientName: '홍길동 대표 (귀하)',
    productType: product.name,
    status: 'pending', // Step 2 "시안확인"
    image: product.image,
    details: {
      qty: `${totalQty}장`,
      print: `${locLabel} / ${typeLabel}`,
      file: uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(', ') : '이메일 발송 예정'
    }
  };

  localStorage.setItem('machuda_new_order', JSON.stringify(newOrder));
}


/* --- B. DESIGN PROOF DASHBOARD LOGIC (Figma B2B Flow) --- */
function initProofDashboardPage() {
  // Load initial proofs
  proofs = [...INITIAL_PROOFS];

  // WOW: Bridge new orders from order page using localStorage
  const localOrder = localStorage.getItem('machuda_new_order');
  if (localOrder) {
    const parsedOrder = JSON.parse(localOrder);
    
    // Check if it already exists to prevent duplicate insertion
    if (!proofs.some(p => p.id === parsedOrder.id)) {
      // Map structure to proof board format
      const formattedProof = {
        id: parsedOrder.id,
        title: parsedOrder.title,
        date: parsedOrder.date,
        clientName: parsedOrder.clientName,
        productType: parsedOrder.productType,
        status: 'pending',
        image: parsedOrder.image,
        comments: [
          {
            id: 'c-sys-init',
            author: '시스템 알림',
            role: 'designer',
            content: `스마트 주문서가 정상 접수되었습니다.\n- 수량: ${parsedOrder.details.qty}\n- 인쇄: ${parsedOrder.details.print}\n- 첨부파일: ${parsedOrder.details.file}\n\n담당 디자이너 배정 후 24시간 내 시안 합성이 진행됩니다. 시안 완료 알림 전까지 대기해주십시오.`,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        ]
      };
      proofs.unshift(formattedProof);
    }
  }

  renderProofList();
  
  // Select first proof by default
  if (proofs.length > 0) {
    selectProof(proofs[0].id);
  }
}

function renderProofList() {
  const container = document.getElementById('proof-sidebar-cards');
  if (!container) return;

  container.innerHTML = proofs.map(proof => {
    let statusText = '시안대기';
    let badgeClass = 'badge-pending';
    if (proof.status === 'approved') {
      statusText = '최종승인';
      badgeClass = 'badge-approved';
    } else if (proof.status === 'revision') {
      statusText = '수정요청';
      badgeClass = 'badge-revision';
    }

    return `
      <div class="proof-item-card ${proof.id === activeProofId ? 'active' : ''}" onclick="selectProof('${proof.id}')">
        <div class="proof-card-header">
          <span class="proof-badge ${badgeClass}">${statusText}</span>
          <span style="font-size: 11px; color: hsl(var(--text-muted));">${proof.date}</span>
        </div>
        <div class="proof-card-title">${proof.title}</div>
        <div class="proof-card-meta">
          <span>${proof.clientName}</span>
          <span>${proof.productType}</span>
        </div>
      </div>
    `;
  }).join('');
}

window.selectProof = function(proofId) {
  activeProofId = proofId;
  renderProofList();
  renderProofDetail();
};

function renderProofDetail() {
  const container = document.getElementById('proof-main-pane');
  if (!container) return;

  const proof = proofs.find(p => p.id === activeProofId);
  if (!proof) return;

  // Compute B2B Stepper active index (Figma Spec)
  // 1: 주문접수, 2: 금액&시안확인, 3: 결제, 4: 제작, 5: 배송중, 6: 배송완료
  let activeStep = 2; // Default for 'pending' or 'revision' is Step 2
  if (proof.status === 'approved') {
    activeStep = 4; // Once design approved, moves past payment to production
  }

  // Figma Lock check: 시안 미확정시 결제하기 비활성화
  const isApproved = proof.status === 'approved';
  const paymentLockNotice = isApproved 
    ? `<span style="color: hsl(var(--status-approved)); font-size: 13px; font-weight: 600;">✓ 시안 확정 완료. 결제 및 제작이 가능합니다.</span>`
    : `<span style="color: hsl(var(--status-revision)); font-size: 13px; font-weight: 600;">* 시안 전체 확정 후 결제 가능합니다.</span>`;

  container.innerHTML = `
    <!-- 1. B2B Stepper (6 steps from Figma) -->
    <div class="b2b-stepper">
      <div class="b2b-step ${activeStep >= 1 ? (activeStep === 1 ? 'active' : 'completed') : ''}">
        <div class="b2b-step-num">1</div>
        <div class="b2b-step-label">주문접수</div>
      </div>
      <div class="b2b-step ${activeStep >= 2 ? (activeStep === 2 ? 'active' : 'completed') : ''}">
        <div class="b2b-step-num">2</div>
        <div class="b2b-step-label">금액&시안확인</div>
      </div>
      <div class="b2b-step ${activeStep >= 3 ? (activeStep === 3 ? 'active' : 'completed') : ''}">
        <div class="b2b-step-num">3</div>
        <div class="b2b-step-label">결제진행</div>
      </div>
      <div class="b2b-step ${activeStep >= 4 ? (activeStep === 4 ? 'active' : 'completed') : ''}">
        <div class="b2b-step-num">4</div>
        <div class="b2b-step-label">제품제작</div>
      </div>
      <div class="b2b-step ${activeStep >= 5 ? (activeStep === 5 ? 'active' : 'completed') : ''}">
        <div class="b2b-step-num">5</div>
        <div class="b2b-step-label">배송중</div>
      </div>
      <div class="b2b-step ${activeStep >= 6 ? (activeStep === 6 ? 'active' : 'completed') : ''}">
        <div class="b2b-step-num">6</div>
        <div class="b2b-step-label">배송완료</div>
      </div>
    </div>

    <!-- 2. Header and actions -->
    <div class="proof-detail-header" style="margin-top: 20px;">
      <div class="detail-title-row">
        <div class="detail-title-section">
          <h3>${proof.title}</h3>
          <div class="detail-meta-text">
            <span>신청인: <strong>${proof.clientName}</strong></span>
            <span>일자: ${proof.date}</span>
          </div>
        </div>
        <div class="detail-actions">
          <button class="btn btn-secondary btn-revision" onclick="requestRevision('${proof.id}')" ${isApproved ? 'disabled' : ''}>시안 수정 요청</button>
          <button class="btn btn-primary btn-approve" onclick="openConfirmModal()" ${isApproved ? 'disabled' : ''}>최종 시안 확정</button>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>${paymentLockNotice}</div>
        <button class="btn btn-primary btn-sm" id="btn-dashboard-pay" ${!isApproved ? 'disabled' : ''} onclick="openPaymentModal()">결제하기 💳</button>
      </div>
    </div>

    <!-- 3. Workspace Split -->
    <div class="proof-workspace">
      <div class="mockup-display-box">
        <img src="${proof.image}" alt="${proof.title}" id="mockup-viewer-img">
        <div class="mockup-zoom-overlay" onclick="toggleZoomMockup()">🔍 확대 / 축소</div>
      </div>

      <div class="feedback-container">
        <div class="feedback-title">시안 조율 및 피드백 히스토리</div>
        <div class="comment-list" id="timeline-comment-list">
          ${proof.comments.map(c => `
            <div class="comment-bubble ${c.role}">
              <div class="comment-meta">
                <span class="comment-author">${c.author}</span>
                <span>${c.date}</span>
              </div>
              <div style="white-space: pre-line;">${c.content}</div>
            </div>
          `).join('')}
        </div>
        <div class="comment-input-area">
          <button class="btn-clip" onclick="triggerFileAttachmentAlert()">📎</button>
          <textarea class="comment-textbox" id="comment-input-box" placeholder="시안 수정 요청사항을 자유롭게 작성해 주세요..."></textarea>
          <button class="btn-send" onclick="sendClientComment('${proof.id}')">전송</button>
        </div>
      </div>
    </div>
  `;

  // Auto scroll down
  setTimeout(() => {
    const list = document.getElementById('timeline-comment-list');
    if (list) list.scrollTop = list.scrollHeight;
  }, 50);
}

// Figma spec: Open Checklist Modal for Final approval
window.openConfirmModal = function() {
  const modal = document.getElementById('confirm-modal');
  modal.style.display = 'flex';
  
  // Reset checkboxes
  document.getElementById('check-option-1').checked = false;
  document.getElementById('check-option-2').checked = false;
  document.getElementById('check-option-3').checked = false;
  document.getElementById('btn-modal-final-approve').disabled = true;

  // Add click listeners to checkboxes to activate button only when all checked
  const checks = document.querySelectorAll('.confirm-check');
  checks.forEach(chk => {
    chk.addEventListener('change', () => {
      const allChecked = Array.from(checks).every(c => c.checked);
      document.getElementById('btn-modal-final-approve').disabled = !allChecked;
    });
  });
};

window.closeConfirmModal = function() {
  document.getElementById('confirm-modal').style.display = 'none';
};

window.executeFinalApprove = function() {
  const proof = proofs.find(p => p.id === activeProofId);
  if (!proof) return;

  proof.status = 'approved';
  
  // Record time log as requested in IA chart (yyyy-mm-dd hh:mm:ss)
  const timeLog = new Date().toISOString().replace('T', ' ').substring(0, 19);

  proof.comments.push({
    id: `c-sys-confirm-${Date.now()}`,
    author: '시스템 알림',
    role: 'designer',
    content: `📢 [시안 확정 로그 - ${timeLog}]\n\n고객님이 모든 주의사항에 동의하고 시안을 최종 승인(컨펌)하셨습니다. 결제가 완료되면 즉시 공장에서 재단 및 봉제(제작)가 개시됩니다.`,
    date: timeLog.substring(0, 16)
  });

  closeConfirmModal();
  renderProofList();
  renderProofDetail();
};

window.requestRevision = function(proofId) {
  const proof = proofs.find(p => p.id === proofId);
  if (!proof) return;

  const text = prompt('디자이너에게 전달할 수정 보완 사항을 입력해 주세요:');
  if (!text || !text.trim()) return;

  proof.status = 'revision';
  
  proof.comments.push({
    id: `c-user-rev-${Date.now()}`,
    author: '김민준 대표 (고객)',
    role: 'client',
    content: `[시안 수정 요청사항]\n${text}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  proof.comments.push({
    id: `c-sys-rev-${Date.now()}`,
    author: '시스템 알림',
    role: 'designer',
    content: `📢 [알림]\n디자인 수정 요청서가 디자이너에게 전달되었습니다. 수정 시안 제작 후 재등록 해드릴 예정입니다.`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  renderProofList();
  renderProofDetail();
};

window.sendClientComment = function(proofId) {
  const proof = proofs.find(p => p.id === proofId);
  if (!proof) return;

  const textBox = document.getElementById('comment-input-box');
  const text = textBox.value.trim();
  if (!text) return;

  proof.comments.push({
    id: `c-user-comment-${Date.now()}`,
    author: '김민준 대표 (고객)',
    role: 'client',
    content: text,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  textBox.value = '';
  renderProofDetail();

  // Simulate Designer response chatbot
  if (proof.status !== 'approved') {
    setTimeout(() => {
      proof.comments.push({
        id: `c-des-comment-${Date.now()}`,
        author: '마추다 디자이너',
        role: 'designer',
        content: `감사합니다. 남겨주신 의견 검토하여 신속히 다음 버그 수정 및 시안에 반영해 드리겠습니다.`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
      renderProofDetail();
    }, 1500);
  }
};

window.triggerFileAttachmentAlert = function() {
  alert('[파일 첨부 시뮬레이션]\n\n마이페이지 댓글창 내 파일 첨부 기능입니다.\n10MB 이하의 이미지 파일(PNG/JPG)을 선택하여 디자이너에게 추가 시각 레퍼런스를 보낼 수 있습니다. (카페24 용량 한도 준수)');
};

// Payment modal simulated checks
window.openPaymentModal = function() {
  document.getElementById('payment-modal').style.display = 'flex';
};

window.closePaymentModal = function() {
  document.getElementById('payment-modal').style.display = 'none';
};

// Zoom toggle
let isZoomed = false;
window.toggleZoomMockup = function() {
  const img = document.getElementById('mockup-viewer-img');
  if (!img) return;

  if (!isZoomed) {
    img.style.transform = 'scale(1.4)';
    img.style.cursor = 'zoom-out';
    isZoomed = true;
  } else {
    img.style.transform = 'scale(1)';
    img.style.cursor = 'zoom-in';
    isZoomed = false;
  }
};
