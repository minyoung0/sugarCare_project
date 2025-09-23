import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ExerciseContents({state,setState}){
    return (
        <div style={{marginTop: 16}}>
            <div className="title">운동 관련 콘텐츠</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16}}>
                {[0, 1, 2].map((i) => (
                    <div key={i} className="card"
                         style={{height: 120, display: "flex", alignItems: "center", justifyContent: "center"}}>
                        플레이스홀더
                    </div>
                ))}
            </div>
            <div className="muted" style={{marginTop: 6}}>스크래핑 연동 예정</div>
        </div>
    )
}
