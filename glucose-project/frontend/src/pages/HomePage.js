// src/pages/HomePage.jsx
import Plot from "react-plotly.js";
import {THEME_PRESETS} from "../theme";
import {statusOf, statusColor} from "../utils/status";
import mapUrl from "../utils/mapUrl";
import {applyPlotlyLayout} from "../utils/plotly";
import "bootstrap/dist/css/bootstrap.min.css"; // 꼭 추가!
import ProfileCard from "../components/home/ProfileCard";
import TodayBlood from "../components/home/TodayBlood";
import Map from "../components/home/Map";
import ExerciseContents from "../components/home/ExerciseContents";
import Market from "../components/home/Market";
export default function HomePage({ state, setState }) {

    return (
        <>
            <div className="row g-3">
                <div className="col-md-4">
                    <ProfileCard state={state} setState={setState} />
                </div>
                <div className="col-md-4">
                    <TodayBlood state={state} />
                </div>
                <div className="col-md-4">
                    <Map state={state} setState={setState} />
                </div>
            </div>

            <div className="mt-4">
                <ExerciseContents />
            </div>

            <div className="mt-4">
                <Market state={state} />
            </div>

            <div className="chat-fab">💬 챗봇</div>
        </>
    );
}
