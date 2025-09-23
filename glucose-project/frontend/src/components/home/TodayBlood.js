import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {statusOf, statusColor} from "../../utils/status";
import Plot from "react-plotly.js";
import {applyPlotlyLayout} from "../../utils/plotly";

export default function TodayBlood({state,setState}){
    const todayBlood = 132;
    const weekX = ["월", "화", "수", "목", "금", "토", "일"];
    const weekY = [110, 128, 140, 120, 150, 135, 118];
    const stt = statusOf(todayBlood);

    return (
        <div className="card">
            <div className="title">오늘의 혈당</div>
            <h2 style={{color: statusColor(stt), margin: 0}}>{todayBlood}</h2>
            <div className="muted">상태: {stt}</div>
            <Plot
                data={[{x: weekX, y: weekY, type: "scatter", mode: "lines", line: {shape: "spline", width: 3}}]}
                layout={applyPlotlyLayout({height: 180, showlegend: false, xaxis: {title: ""}, yaxis: {title: ""}}, state.dark)}
                style={{width: "100%"}}
                config={{displayModeBar: false}}
            />
        </div>
    )
}