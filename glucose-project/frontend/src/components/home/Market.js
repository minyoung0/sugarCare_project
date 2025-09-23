import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {THEME_PRESETS} from "../../theme";

export default function  Market({ state, setState }) {
    return(
        <div style={{marginTop: 16}}>
            <div className="title">추천 상품</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16}}>
                {[
                    ["저당 스낵 A", "식이섬유 UP", true],
                    ["저당 스낵 B", "당류 낮음", true],
                    ["활동 트래커", "만보기/심박", false],
                    ["저GI 식단 키트", "일주일분", false],
                ].map(([t, cap, aff], idx) => (
                    <div key={idx} className="card" style={{position: "relative"}}>
                        <div style={{height: 96, background: "#e5e7eb", borderRadius: 10, marginBottom: 8}}/>
                        {aff && (
                            <span
                                style={{
                                    position: "absolute", top: 8, left: 8,
                                    background: THEME_PRESETS[state.theme].PRIMARY,
                                    color: "#fff", padding: "2px 6px", borderRadius: 6, fontSize: 12,
                                }}
                            >
                  제휴
                </span>
                        )}
                        <div>{t}</div>
                        <div className="muted">{cap}</div>
                    </div>
                ))}
            </div>
        </div>
    )

}