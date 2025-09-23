// src/components/TopNav.jsx
import 오당탕탕 from "../assets/오당탕탕.png";
import TogglePanel from "./TogglePanel";

export default function TopNav({state, setState}) {
    return (
        <header className="header-bar">
            <div className="header-top">
                <img src={오당탕탕} alt="오당탕탕" className="main_logo" />
            </div>
            <div className="header-bottom">
                <TogglePanel state={state} setState={setState} />
            </div>
        </header>
    );
}
