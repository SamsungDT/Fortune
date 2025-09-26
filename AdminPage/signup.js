// signup.js

const API_BASE_URL = 'http://localhost:8080';
const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    // 폼 데이터 수집
    const formData = new FormData(signupForm);
    const data = {};
    for (let [key, value] of formData.entries()) {
        // 백엔드 DTO에 맞게 숫자 타입으로 변환
        if (['birthYear', 'birthMonth', 'birthDay'].includes(key)) {
            data[key] = parseInt(value, 10);
        } else {
            data[key] = value;
        }
    }

    console.log("전송할 데이터:", data);

    try {
        const response = await fetch(`${API_BASE_URL}/admin/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('회원가입이 성공적으로 완료되었습니다! 🎉 로그인 페이지로 이동합니다.');
            // 회원가입 성공 시 로그인 페이지로 자동 이동
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            alert(`회원가입 실패: ${error.message}`);
            console.error("회원가입 오류:", error);
        }
    } catch (error) {
        console.error("네트워크 오류:", error);
        alert('네트워크 오류가 발생했습니다. 서버 연결을 확인해주세요.');
    }
});