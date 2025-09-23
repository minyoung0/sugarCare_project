import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


export default function ProfileCard({state, setState}) {
    return (
        <div className="card shadow-sm">
            <div className="card-body text-center">
                <div
                    className="rounded-circle mx-auto mb-3"
                    style={{
                        width: 64,
                        height: 64,
                        background: "linear-gradient(135deg,#14b8a6,#0f766e)",
                    }}
                ></div>
                <h5>{state.profile.name}</h5>
                <p className="text-muted">건강 등급: B</p>

                <div className="d-grid gap-2">
                    {state.isLoggedIn ? (
                        <>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setState((s) => ({...s, page: "내 페이지"}))}
                            >
                                내 프로필 보기
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={() => setState((s) => ({...s, isLoggedIn: false, page: "홈"}))}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-success"
                            onClick={() => setState((s) => ({...s, page: "로그인페이지"}))}
                        >
                            로그인
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
        ;
}
