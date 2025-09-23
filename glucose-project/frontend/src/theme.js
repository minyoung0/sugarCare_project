// src/theme.js
export const THEME_PRESETS = {
    스카이: {PRIMARY: "#38BDF8", PRIMARY2: "#7DD3FC", PRGBA: "56, 189, 248"},
    "연한 레드": {PRIMARY: "#F87171", PRIMARY2: "#FCA5A5", PRGBA: "248, 113, 113"},
    "진한 레드": {PRIMARY: "#EF4444", PRIMARY2: "#F87171", PRGBA: "239, 68, 68"},
    보라: {PRIMARY: "#A78BFA", PRIMARY2: "#C4B5FD", PRGBA: "167, 139, 250"},
    "딥 그린": {PRIMARY: "#166534", PRIMARY2: "#22C55E", PRGBA: "22, 101, 52"},
    틸: {PRIMARY: "#0D9488", PRIMARY2: "#14B8A6", PRGBA: "13, 148, 136"},
};

export const defaultState = {
    dark: false,
    big: false,
    page: "홈",
    entries: {},               // 'YYYY-MM-DD' → { glucose:number, note:string }
    foods: [],
    profile: {name: "Guest", height: 170, weight: 68, waist: 82},
    city: "서울",
    coords: {lat: 37.5665, lon: 126.978},
    theme: "딥 그린",
    isLoggedIn:false
};
