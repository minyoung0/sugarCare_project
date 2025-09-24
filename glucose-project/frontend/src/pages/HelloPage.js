import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HelloPage() {
    const [msg, setMsg] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/hello")
            .then(res => {
                console.log("서버 응답:", res.data);
                setMsg(res.data.msg); // FastAPI에서 받은 데이터
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="card">
            <div className="title">FastAPI 연동 테스트</div>
            <p>응답: {msg}</p>
        </div>
    );
}
