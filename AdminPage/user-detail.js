// user-detail.js

// JWT 토큰 관련 함수와 fetchWithAuth 함수를 재사용하기 위해 포함
const API_BASE_URL = '';
const TOKEN_KEY = 'jwtToken';

function getJwtToken() {
    return localStorage.getItem(TOKEN_KEY);
}

async function fetchWithAuth(url, options = {}) {
    const token = getJwtToken();
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = 'index.html';
        throw new Error('No JWT token found');
    }

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, options);
    if (response.status === 401 || response.status === 403) {
        alert('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
        window.location.href = 'index.html';
        throw new Error('Authentication failed');
    }
    // API 호출이 성공했는지 확인
    if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }
    return response;
}

// URL에서 userId를 안전하게 추출하는 함수
function getUserIdFromUrl() {
    try {
        const urlParams = new URL(window.location.href).searchParams;
        return urlParams.get('userId');
    } catch (e) {
        console.error("URL 파싱 오류:", e);
        return null;
    }
}

// 사용자 상세 정보를 가져와서 화면에 표시하는 함수
async function fetchUserDetail(userId) {
    const userDetailContent = document.getElementById('user-detail-content');

    if (!userId) {
        userDetailContent.innerHTML = '<p class="error-message">사용자 ID를 찾을 수 없습니다.</p>';
        return;
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        });

        const apiResponse = await response.json();
        const user = apiResponse.data;

        if (!user) {
            userDetailContent.innerHTML = `<p class="error-message">사용자 정보를 찾을 수 없습니다.</p>`;
            return;
        }

        renderUserDetail(user);

    } catch (error) {
        console.error("Fetch user detail error:", error);
        userDetailContent.innerHTML = `<p class="error-message">사용자 정보를 불러오지 못했습니다: ${error.message}</p>`;
    }
}

// 사용자 상세 정보를 렌더링하고 버튼에 이벤트를 바인딩하는 함수
function renderUserDetail(user) {
    const userDetailContent = document.getElementById('user-detail-content');

    const birthInfo = user.birthInfo;
    const birthDate = birthInfo ? `${birthInfo.birthYear}-${birthInfo.birthMonth}-${birthInfo.birthDay}` : '정보 없음';
    const blackListInfo = user.isBlackList ? '블랙 리스트에 등재되어 있습니다.' : '블랙 리스트에 등재되어 있지 않습니다.';

    // isBlackList 상태에 따라 버튼의 disabled 상태를 결정
    const isBlacklisted = user.isBlackList;
    const disabledAttr = isBlacklisted ? 'disabled' : '';

    // HTML 구조에 버튼 추가 및 데이터 바인딩
    userDetailContent.innerHTML = `
        <div class="user-info-item">
            <span class="label">유저 ID:</span>
            <span class="value">${user.userId || '정보 없음'}</span>
        </div>
        <div class="user-info-item">
            <span class="label">이메일:</span>
            <span class="value">${user.email || '정보 없음'}</span>
        </div>
        <div class="user-info-item">
            <span class="label">이름:</span>
            <span class="value">${user.name || '정보 없음'}</span>
        </div>
        <div class="user-info-item">
            <span class="label">성별:</span>
            <span class="value">${user.sex || '정보 없음'}</span>
        </div>
        <div class="user-info-item">
            <span class="label">생년월일:</span>
            <span class="value">${birthDate}</span>
        </div>
        <div class="user-info-item">
            <span class="label">역할:</span>
            <span class="value">${user.role || '정보 없음'}</span>
        </div>
        <div class="user-info-item">
            <span class="label">남은 운세 조회 횟수:</span>
            <span class="value">${user.remainingLimitCount !== null ? user.remainingLimitCount : '정보 없음'}</span>
        </div>
        <div class="user-info-item">
            <span class="label">블랙 리스트 여부:</span>
            <span class="value">${blackListInfo || '정보 없음'}</span>
        </div>
        <div class="action-buttons">
            <h3>사용자 관리</h3>
            <button id="deleteUserBtn" class="action-btn delete-btn">회원 삭제</button>
            <button id="expireTokenBtn" class="action-btn expire-btn">토큰 만료</button>
            <button id="addToBlacklistBtn" class="action-btn blacklist-btn" ${disabledAttr}>블랙리스트에 추가</button>
            <div class="add-fortune-section">
                <input type="number" id="fortuneCountInput" placeholder="횟수" min="1" value="1">
                <button id="addFortuneBtn" class="action-btn fortune-btn">무료 운세 추가</button>
            </div>
        </div>
    `;

    // **새로 추가된 버튼에 이벤트 리스너 바인딩**
    document.getElementById('deleteUserBtn').addEventListener('click', () => deleteUser(user.userId));
    document.getElementById('expireTokenBtn').addEventListener('click', () => expireUserToken(user.userId));

    const addToBlacklistBtn = document.getElementById('addToBlacklistBtn');
    if (addToBlacklistBtn) {
        addToBlacklistBtn.addEventListener('click', () => addToBlacklist(user.userId));
    }

    document.getElementById('addFortuneBtn').addEventListener('click', () => {
        const count = document.getElementById('fortuneCountInput').value;
        addFreeFortuneCount(user.userId, count);
    });
}

// 회원 삭제 API 호출
async function deleteUser(userId) {
    if (!confirm('정말 이 회원을 삭제하시겠습니까?')) return;
    try {
        await fetchWithAuth(`${API_BASE_URL}/admin/user`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        alert('회원 삭제가 완료되었습니다.');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Delete user error:", error);
        alert(`회원 삭제 실패: ${error.message}`);
    }
}

// 토큰 만료 API 호출
async function expireUserToken(userId) {
    if (!confirm('정말 이 회원의 토큰을 만료시키겠습니까?')) return;
    try {
        await fetchWithAuth(`${API_BASE_URL}/admin/refresh-expired`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        alert('회원 토큰이 만료되었습니다.');
        fetchUserDetail(userId); // 정보 새로고침
    } catch (error) {
        console.error("Expire token error:", error);
        alert(`토큰 만료 실패: ${error.message}`);
    }
}

// 블랙리스트에 추가 API 호출
async function addToBlacklist(userId) {
    if (!confirm('정말 이 회원을 블랙리스트에 추가하시겠습니까?')) return;
    try {
        await fetchWithAuth(`${API_BASE_URL}/admin/blacklist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        alert('회원이 블랙리스트에 추가되었습니다.');
        fetchUserDetail(userId); // 정보 새로고침
    } catch (error) {
        console.error("Add to blacklist error:", error);
        alert(`블랙리스트 추가 실패: ${error.message}`);
    }
}

// 무료 운세 횟수 추가 API 호출
async function addFreeFortuneCount(userId, count) {
    if (count <= 0) {
        alert('1 이상의 횟수를 입력해주세요.');
        return;
    }
    if (!confirm(`무료 운세 조회 횟수 ${count}회를 추가하시겠습니까?`)) return;

    try {
        await fetchWithAuth(`${API_BASE_URL}/admin/add-free-fortune/${count}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        alert('무료 운세 조회 횟수가 추가되었습니다.');
        fetchUserDetail(userId); // 정보 새로고침
    } catch (error) {
        console.error("Add free fortune count error:", error);
        alert(`무료 운세 추가 실패: ${error.message}`);
    }
}

// 페이지 로드 시 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    const userId = getUserIdFromUrl();
    fetchUserDetail(userId);
});