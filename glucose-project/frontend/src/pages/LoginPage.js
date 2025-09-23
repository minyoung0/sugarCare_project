import React, { useState } from "react";
import axios from "axios";

export default function LoginPage({ state, setState }) {
    const [form, setForm] = useState({ userId: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:8080/user/login", form);

            alert("로그인 성공!");
            // 서버에서 사용자 이름 등을 내려주면 profile에 저장
            setState((s) => ({
                ...s,
                isLoggedIn: true,
                profile: res.data, // 예: {name:"홍길동", height:170, weight:65 ...}
                page: "홈",
            }));
        } catch (err) {
            alert("로그인 실패: 아이디/비밀번호 확인하세요");
            console.error(err);
        }
    };

    return (
        <div className="card">
            <div className="title">로그인</div>
            <input
                name="userId"
                placeholder="아이디"
                value={form.userId}
                onChange={handleChange}
                style={{ display: "block", marginBottom: 8 }}
            />
            <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={handleChange}
                style={{ display: "block", marginBottom: 8 }}
            />
            <button className="primary" onClick={handleLogin}>
                로그인
            </button>
            <button onClick={() => setState((s) => ({ ...s, page: "회원가입페이지" }))}>
                회원가입
            </button>
            <div style={{ marginTop: 8 }}>
                <button onClick={() => setState((s) => ({ ...s, page: "홈" }))}>
                    홈으로
                </button>
            </div>
        </div>
    );
}
