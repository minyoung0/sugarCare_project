// src/App.jsx
import React from "react";
import "./App.css";
import useLocalState from "./hooks/useLocalState";
import useInjectCSS from "./hooks/useInjectCSS";
import TopNav from "./components/TopNav";
import Segmented from "./components/Segmented";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/JoinPage";

export default function App() {
    const [state, setState] = useLocalState();
    useInjectCSS({dark: state.dark, big: state.big});

    return (
        <div style={{display: "grid", gap: 12}}>
            <TopNav state={state} setState={setState}/>
            <hr style={{opacity: 0.2}}/>

            <div style={{display: "flex", alignItems: "center", gap: 12}}>
                <span>페이지</span>
                <Segmented
                    value={state.page}
                    onChange={(v) => setState((s) => ({...s, page: v}))}
                    options={["홈", "내 페이지"]}
                />
            </div>


            {state.page === "홈" ? (
                <HomePage state={state} setState={setState} />
            ) : state.page === "내 페이지" ? (
                <MyPage state={state} setState={setState} />
            ) : state.page === "로그인페이지" ? (
                <LoginPage state={state} setState={setState} />
            ) : state.page === "회원가입페이지" ? (
                <SignupPage state={state} setState={setState} />
            ) : null}


        </div>
    );
}
