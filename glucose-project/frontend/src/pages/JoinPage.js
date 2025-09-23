// src/pages/SignupPage.jsx
import React, { useState,useEffect } from "react";
import axios from "axios";

export default function SignupPage({ state, setState }) {
    // 입력값 상태
    const [form, setForm] = useState({
        userId: "",
        password: "",
        userName: "",
        userType: "관리", // 기본값: 관리
        guardianUserId:""
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 회원가입 버튼 클릭 시
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("회원가입 데이터:", form);

        try {
            const res = await axios.post("http://localhost:8080/user/join", form);
            console.log("서버 응답:", res.data);
            alert("회원가입 완료! 🎉 로그인 진행하세요");
            setState((s) => ({ ...s, page: "홈" }));
        } catch (err) {
            console.error("회원가입 실패:", err);
            alert("회원가입 실패 😢");
        }
    };


    return (
        <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
            <div className="title">회원가입</div>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <input
                    type="text"
                    name="userId"
                    placeholder="아이디"
                    value={form.userId}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="userName"
                    placeholder="이름"
                    value={form.userName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="guardianUserId"
                    placeholder="보호자명"
                    value={form.guardianUserId}
                    onChange={handleChange}
                    required
                />

                <div>
                    혈당관련 질병 보유 여부
                    <label>
                        <input
                            type="radio"
                            name="userType"
                            value="Y"
                            checked={form.userType === "Y"}
                            onChange={handleChange}
                        />
                        Y
                    </label>
                    <label style={{ marginLeft: "12px" }}>
                        <input
                            type="radio"
                            name="userType"
                            value="N"
                            checked={form.userType === "N"}
                            onChange={handleChange}
                        />
                        N
                    </label>
                </div>

                <button type="submit" className="primary">
                    회원가입
                </button>
            </form>
            <div style={{ marginTop: 8 }}>
                <button onClick={() => setState((s) => ({ ...s, page: "로그인페이지" }))}>
                    로그인으로 이동
                </button>
            </div>
        </div>
    );
}
