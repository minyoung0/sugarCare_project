// src/components/TogglePanel.jsx
import {THEME_PRESETS} from "../theme";

export default function TogglePanel({state, setState}) {
    const themes = Object.keys(THEME_PRESETS);
    return (
        <div style={{display: "flex", gap: 12, alignItems: "center", justifyContent: "flex-end"}}>
            <label>
                <input
                    type="checkbox"
                    checked={state.big}
                    onChange={(e) => setState((s) => ({...s, big: e.target.checked}))}
                />{" "}
                큰글씨
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={state.dark}
                    onChange={(e) => setState((s) => ({...s, dark: e.target.checked}))}
                />{" "}
                다크모드
            </label>
            {/*<select*/}
            {/*    value={state.theme}*/}
            {/*    onChange={(e) => setState((s) => ({...s, theme: e.target.value}))}*/}
            {/*>*/}
            {/*    {themes.map((t) => (*/}
            {/*        <option key={t} value={t}>{t}</option>*/}
            {/*    ))}*/}
            {/*</select>*/}
        </div>
    );
}
