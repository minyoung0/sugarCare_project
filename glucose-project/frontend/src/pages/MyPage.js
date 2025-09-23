// src/pages/MyPage.jsx
import {useMemo, useState} from "react";
import Plot from "react-plotly.js";
import monthGrid from "../utils/monthGrid";
import {applyPlotlyLayout} from "../utils/plotly";

export default function MyPage({state, setState}) {
    const p = state.profile;
    const [name, setName] = useState(p.name);
    const [height, setHeight] = useState(p.height);
    const [weight, setWeight] = useState(p.weight);
    const [waist, setWaist] = useState(p.waist);

    const bmi = useMemo(() => (weight / Math.pow(height / 100, 2)).toFixed(1), [height, weight]);

    const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [entryGlu, setEntryGlu] = useState(0);
    const [entryNote, setEntryNote] = useState("");

    const month = useMemo(() => new Date(entryDate).getMonth() + 1, [entryDate]);
    const year = useMemo(() => new Date(entryDate).getFullYear(), [entryDate]);

    const grid = useMemo(() => monthGrid(year, month), [year, month]);
    const monthPrefix = `${year}-${String(month).padStart(2, "0")}-`;

    const dayX = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    const dayY = [98, 120, 140, 130, 150, 125];

    const sameMonthRows = useMemo(() => {
        return Object.entries(state.entries)
            .filter(([k]) => k.startsWith(monthPrefix))
            .sort(([a], [b]) => (a < b ? -1 : 1))
            .map(([k, v]) => ({날짜: k, 혈당: v.glucose, 메모: v.note || ""}));
    }, [state.entries, monthPrefix]);

    const saveEntry = () => {
        if (!entryDate) return;
        setState((s) => ({
            ...s,
            entries: {
                ...s.entries,
                [entryDate]: {glucose: Number(entryGlu), note: entryNote},
            },
        }));
        setEntryNote("");
    };

    const saveProfile = () => {
        setState((s) => ({...s, profile: {name, height, weight, waist}}));
    };

    return (
        <div style={{display: "grid", gridTemplateColumns: "1.1fr 2.2fr 1.1fr", gap: 16}}>
            <div>
                <div className="title">프로필</div>
                <div
                    style={{
                        width: 96, height: 96, borderRadius: 999,
                        background: "linear-gradient(135deg,#14b8a6,#0f766e)", marginBottom: 8,
                    }}
                />
                <div style={{display: "grid", gap: 8}}>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름"/>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} placeholder="키(cm)"/>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} placeholder="몸무게(kg)"/>
                    <input type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value))} placeholder="허리둘레(cm)"/>
                    <div><strong>BMI</strong> {bmi}</div>
                    <button onClick={saveProfile} className="primary">저장</button>
                </div>
            </div>

            <div>
                <div className="title">오늘 혈당 추이</div>
                <div className="card">
                    <Plot
                        data={[{ x: dayX, y: dayY, type: "scatter", mode: "lines+markers", line: {width: 3}, marker: {size: 6} }]}
                        layout={applyPlotlyLayout({height: 260}, state.dark)}
                        style={{width: "100%"}}
                        config={{displayModeBar: false}}
                    />
                </div>

                <div style={{marginTop: 12}}/>
                <div className="title">자가테스트 달력</div>
                <div className="card" style={{display: "grid", gap: 8}}>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8}}>
                        <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)}/>
                        <input type="number" value={entryGlu} onChange={(e) => setEntryGlu(e.target.value)} placeholder="혈당"/>
                        <input value={entryNote} onChange={(e) => setEntryNote(e.target.value)} placeholder="메모"/>
                    </div>
                    <div>
                        <button onClick={saveEntry} className="primary">저장</button>
                    </div>

                    <table className="calendar">
                        <thead>
                        <tr className="muted">
                            {"일 월 화 수 목 금 토".split(" ").map((d) => (
                                <th key={d} style={{fontWeight: 600, textAlign: "left"}}>{d}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {grid.map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) => {
                                    if (cell === "") return <td key={j}></td>;
                                    const key = `${year}-${String(month).padStart(2, "0")}-${String(cell).padStart(2, "0")}`;
                                    const ent = state.entries[key];
                                    const chip = ent ? <span className="chip">{ent.glucose}</span> : null;
                                    const note = ent?.note ? (
                                        <div className="muted" style={{marginTop: 4, fontSize: 12}}>{ent.note}</div>
                                    ) : null;
                                    return (
                                        <td key={j}>
                                            <div className="muted" style={{fontSize: 12}}>{cell}</div>
                                            {chip}
                                            {note}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {sameMonthRows.length ? (
                        <div>
                            <div className="muted" style={{marginTop: 6}}>이 달의 기록</div>
                            <div style={{overflowX: "auto"}}>
                                <table>
                                    <thead>
                                    <tr><th>날짜</th><th>혈당</th><th>메모</th></tr>
                                    </thead>
                                    <tbody>
                                    {sameMonthRows.map((r) => (
                                        <tr key={r.날짜}>
                                            <td>{r.날짜}</td>
                                            <td>{r.혈당}</td>
                                            <td>{r.메모}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="muted">이 달에는 저장된 기록이 없습니다.</div>
                    )}
                </div>
            </div>

            <div>
                <div className="title">오늘 먹은 것</div>
                <div className="card">
                    <div style={{display: "grid", gridTemplateColumns: "3fr 1fr", gap: 8}}>
                        <input
                            placeholder="추가 (예: 오트밀, 샐러드)"
                            value={state.food_in || ""}
                            onChange={(e) => setState((s) => ({...s, food_in: e.target.value}))}
                        />
                        <button
                            className="primary"
                            onClick={() => {
                                const t = (state.food_in || "").trim();
                                if (t) setState((s) => ({...s, foods: [t, ...s.foods], food_in: ""}));
                            }}
                        >
                            추가
                        </button>
                    </div>
                    <div style={{marginTop: 8}}>
                        {state.foods.length ? (
                            <ul style={{margin: 0, paddingLeft: 18}}>
                                {state.foods.map((f, i) => (<li key={i}>{f}</li>))}
                            </ul>
                        ) : (
                            <div className="muted">아직 기록이 없어요</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
