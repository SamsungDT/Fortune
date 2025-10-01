const API_BASE_URL = '';
const TOKEN_KEY = 'jwtToken';

const loginSection = document.getElementById('login-section');
const adminContent = document.getElementById('admin-content');
const logoutBtn = document.getElementById('logoutBtn');

// 로그인 관련 요소
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const signupRedirectBtn = document.getElementById('signupRedirectBtn');

// 기타 UI 요소
const userTableBody = document.getElementById('user-table-body');
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const pageInfoSpan = document.getElementById('page-info');
// 페이지 단위 선택 드롭다운 요소
const pageSizeSelect = document.getElementById('pageSizeSelect');

let currentPage = 0;
// 초기 페이지 크기를 드롭다운의 기본값으로 설정
let pageSize = 10;

// JWT 토큰을 localStorage에서 가져오거나 설정하는 함수
function getJwtToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setJwtToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function removeJwtToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// JWT 토큰을 헤더에 추가하여 요청을 보내는 헬퍼 함수
async function fetchWithAuth(url, options = {}) {
    const token = getJwtToken();
    if (!token) {
        alert('로그인이 필요합니다.');
        handleLogout();
        throw new Error('No JWT token found');
    }

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, options);
    if (response.status === 401 || response.status === 403) {
        alert('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
        handleLogout();
        throw new Error('Authentication failed');
    }
    return response;
}

// UI 상태를 업데이트하는 함수
function updateUI(isLoggedIn) {
    loginSection.style.display = isLoggedIn ? 'none' : 'block';
    adminContent.style.display = isLoggedIn ? 'block' : 'none';
    logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
}

// 관리자 로그인 함수
async function handleLogin() {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/security/email/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
        }

        const result = await response.json();
        const accessToken = result.data.accessToken;

        setJwtToken(accessToken);
        alert('로그인 성공!');

        updateUI(true);
        fetchUsers(currentPage);
    } catch (error) {
        console.error("Login error:", error);
        alert(error.message);
    }
}

// 로그아웃 함수
function handleLogout() {
    removeJwtToken();
    alert('로그아웃 되었습니다.');
    updateUI(false);
}

// 회원 목록을 가져오는 함수
async function fetchUsers(page) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/admin/users?page=${page}&size=${pageSize}`, {
            method: 'GET'
        });
        const apiResponse = await response.json();
        const users = apiResponse.data.content;
        const totalPages = apiResponse.data.totalPages;

        renderUsers(users);
        updatePagination(totalPages);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// 테이블에 사용자 데이터를 렌더링하는 함수 (데이터 유효성 검사 추가)
function renderUsers(users) {
    userTableBody.innerHTML = '';
    users.forEach(user => {
        const idToUse = user.userId || user.id;
        const birthInfo = user.birthInfo;
        const birthDate = birthInfo ? `${birthInfo.birthYear}-${birthInfo.birthMonth}-${birthInfo.birthDay}` : '정보 없음';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="user-detail.html?userId=${idToUse}">${idToUse || '정보 없음'}</a></td>
            <td>${user.email || '정보 없음'}</td>
            <td>${user.name || '정보 없음'}</td>
            <td>${user.sex || '정보 없음'}</td>
            <td>${birthDate}</td>
            <td>${user.role || '정보 없음'}</td>
        `;
        userTableBody.appendChild(row);
    });
}

// 페이지네이션 버튼 상태 업데이트 (변경 없음)
function updatePagination(totalPages) {
    pageInfoSpan.textContent = `페이지 ${currentPage + 1} / ${totalPages}`;
    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = currentPage >= totalPages - 1;
}

// 초기 로딩 시 로그인 상태 확인 및 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    const token = getJwtToken();
    if (token) {
        updateUI(true);
        fetchUsers(currentPage);
    } else {
        updateUI(false);
    }

    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    signupRedirectBtn.addEventListener('click', () => {
        window.location.href = 'signup.html';
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            fetchUsers(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        fetchUsers(currentPage);
    });

    // **추가된 부분:** 페이지 단위 선택 드롭다운 이벤트 리스너
    pageSizeSelect.addEventListener('change', (event) => {
        pageSize = parseInt(event.target.value, 10);
        currentPage = 0; // 페이지 크기가 변경되면 첫 페이지로 리셋
        fetchUsers(currentPage);
    });
});