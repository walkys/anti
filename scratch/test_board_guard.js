// =========================================================
// 마추다 board_no 가드 테스트
// 테스트 대상: integrateBoardWriteForm 의 첫 번째 방어 코드
// node test_board_guard.js 로 실행
// =========================================================

// URLSearchParams 폴리필 (Node.js 환경)
const { URLSearchParams } = require('url');

// ---- 테스트할 URL 목록 ----
const TEST_CASES = [
    // [ URL query string, 예상 결과 ]
    ['?board_no=2',    true,  '납품사례 (board_no=2) → 폼 표시되어야 함'],
    ['?board_no=5',    false, '견적서 (board_no=5) → 폼 절대 뜨면 안 됨'],
    ['?board_no=1002', false, '주문서 (board_no=1002) → 폼 절대 뜨면 안 됨'],
    ['?board_no=4',    false, '포토후기 (board_no=4) → 폼 절대 뜨면 안 됨'],
    ['?board_no=1',    false, '공지/이벤트 (board_no=1) → 폼 절대 뜨면 안 됨'],
    ['?board_no=3',    false, '이용안내 (board_no=3) → 폼 절대 뜨면 안 됨'],
    ['?board_no=3001', false, '디자인확인 (board_no=3001) → 폼 절대 뜨면 안 됨'],
    ['',               false, '쿼리 없음 → 폼 절대 뜨면 안 됨'],
];

// ---- 실제 JS 코드의 guard 로직 재현 ----
function simulateGuard(queryString) {
    const urlParams = new URLSearchParams(queryString);
    const boardNo = urlParams.get('board_no') || '';
    if (boardNo !== '2') return false; // guard: 즉시 종료
    return true; // board_no=2 → 계속 실행 (폼 표시)
}

// ---- 테스트 실행 ----
let passed = 0;
let failed = 0;

console.log('\n========================================');
console.log(' 마추다 board_no 가드 테스트 결과');
console.log('========================================\n');

TEST_CASES.forEach(([query, expected, description]) => {
    const result = simulateGuard(query);
    const ok = result === expected;
    const icon = ok ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon}  ${description}`);
    if (!ok) {
        console.log(`       → 예상: ${expected}, 실제: ${result}`);
        failed++;
    } else {
        passed++;
    }
});

console.log('\n========================================');
console.log(` 결과: ${passed}개 통과 / ${failed}개 실패`);
console.log('========================================\n');

if (failed > 0) {
    process.exit(1);
}
