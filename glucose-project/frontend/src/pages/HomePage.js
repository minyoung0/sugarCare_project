import "bootstrap/dist/css/bootstrap.min.css"; // 꼭 추가!
import ProfileCard from "../components/home/ProfileCard";
import TodayBlood from "../components/home/TodayBlood";
import Map from "../components/home/Map";
import ExerciseContents from "../components/home/ExerciseContents";
import Market from "../components/home/Market";
import HelloPage from "./HelloPage";

export default function HomePage({ state, setState }) {

    return (
        <>
            <p><HelloPage></HelloPage></p>
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
