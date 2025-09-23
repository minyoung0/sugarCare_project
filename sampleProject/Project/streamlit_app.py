# -*- coding: utf-8 -*-
import time
import base64
from pathlib import Path
from datetime import date, timedelta

import streamlit as st
import pandas as pd
import plotly.express as px

# -----------------------------
# 기본 설정 & 세션
# -----------------------------
st.set_page_config(page_title="오당탕탕 · Blood Sugar Dashboard", page_icon="🩸", layout="wide")
ss = st.session_state
ss.setdefault("dark", False)
ss.setdefault("big", False)
ss.setdefault("page", "홈")
ss.setdefault("boot_done", False)
ss.setdefault("entries", {})   # 'YYYY-MM-DD' -> {"glucose":int, "note":str}
ss.setdefault("foods", [])
ss.setdefault("profile", {"name": "홍길동", "height": 170, "weight": 68, "waist": 82})
ss.setdefault("city", "서울")
ss.setdefault("coords", {"lat": 37.5665, "lon": 126.978})  # 서울
ss.setdefault("theme", "딥 그린")  # 테마 기본값: 하늘색 | 연한 빨강 | 진한 빨강

# 버튼에서 바로 ss.page를 바꾸면 위젯 충돌 → 플래그로 우회
if "navigate_to" in ss:
    ss.page = ss.navigate_to
    del ss["navigate_to"]

# -----------------------------
# 테마 팔레트
# -----------------------------
def _theme_colors(name: str):
    if name == "스카이":
        return {"PRIMARY": "#38BDF8", "PRIMARY2": "#7DD3FC", "PRGBA": "56, 189, 248"}
    if name == "연한 레드":
        return {"PRIMARY": "#F87171", "PRIMARY2": "#FCA5A5", "PRGBA": "248, 113, 113"}
    if name == "진한 레드":
        return {"PRIMARY": "#EF4444", "PRIMARY2": "#F87171", "PRGBA": "239, 68, 68"}
    if name == "보라":
        return {"PRIMARY": "#A78BFA", "PRIMARY2": "#C4B5FD", "PRGBA": "167, 139, 250"}

    # ★ 새로 추가: 짙은 녹색(딥 그린) & 예전에 쓰던 틸
    if name == "딥 그린":
        # emerald-800 / green-500 느낌
        return {"PRIMARY": "#166534", "PRIMARY2": "#22C55E", "PRGBA": "22, 101, 52"}
    if name == "틸":
        # 예전에 쓰던 그 색 조합
        return {"PRIMARY": "#0D9488", "PRIMARY2": "#14B8A6", "PRGBA": "13, 148, 136"}

    # 기본값(없으면 틸로)
    return {"PRIMARY": "#0D9488", "PRIMARY2": "#14B8A6", "PRGBA": "13, 148, 136"}


# -----------------------------
# CSS (다크모드 하드닝 유지)
# -----------------------------
def inject_css(dark: bool, big: bool, theme_name: str):
    bg_light, fg_light, card_light, border_light = "#EAF7F3", "#0F172A", "#FFFFFF", "#D7E7E1"
    bg_dark,  fg_dark,  card_dark,  border_dark  = "#0B1218", "#E6E9EF", "#0F172A", "#243243"

    bg     = bg_dark if dark else bg_light
    fg     = fg_dark if dark else fg_light
    card   = card_dark if dark else card_light
    border = border_dark if dark else border_light

    size   = "23px" if big else "16px"
    shadow = "0 10px 30px rgba(0,0,0,.35)" if dark else "0 8px 24px rgba(0,0,0,.10)"

    C = _theme_colors(theme_name)
    PRIMARY, PRIMARY2, PRGBA = C["PRIMARY"], C["PRIMARY2"], C["PRGBA"]

    st.markdown(
        "<link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap' rel='stylesheet'>",
        unsafe_allow_html=True,
    )

    # 주의: f-string 안의 { }는 변수 치환에 쓰임. CSS의 "그냥 중괄호"는 대부분 변수 포함 구문이므로 오류 없이 동작.
    st.markdown(f"""
    <style>
    /* 본체 */
    html, body, .stApp,
    [data-testid="stAppViewContainer"],
    [data-testid="block-container"],
    .main, .block-container {{
      background:{bg} !important;
      color:{fg} !important;
      font-size:{size};
      font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
    }}
    [data-testid="stHeader"] {{ background:{bg} !important; }}

    /* 카드 */
    .card {{
      background:{card};
      border:1px solid {border};
      border-radius:16px;
      padding:16px;
      box-shadow:{shadow};
    }}

    /* 타이틀 */
    .title {{
      margin:0 0 10px 0;
      font-weight:800;
      color:{PRIMARY};
      letter-spacing:.2px;
    }}

    /* 브랜드 pill */
    .pill {{
      display:inline-flex;align-items:center;gap:8px;
      background:{PRIMARY}; color:#fff;
      border:1px solid {PRIMARY2};
      border-radius:16px; padding:8px 12px;
      box-shadow:0 10px 28px rgba({PRGBA}, .30);
    }}

    /* 로딩 pill */
    .loading-pill {{
      position:fixed; right:24px; top:16px; z-index:9999;
      display:flex; gap:8px; align-items:center;
      background:rgba(0,0,0,.70); color:#fff;
      padding:8px 12px; border-radius:999px;
      box-shadow:0 10px 30px rgba(0,0,0,.30);
    }}
    @keyframes run {{ 0%{{transform:translateX(0)}} 50%{{transform:translateX(6px)}} 100%{{transform:translateX(0)}} }}
    .runner {{ animation: run .6s ease-in-out infinite; }}

    /* FAB */
    .chat-fab {{
      position:fixed; right:24px; bottom:24px; z-index:9999;
      background:{PRIMARY}; color:#fff;
      border-radius:999px; padding:14px 16px;
      box-shadow:0 10px 30px rgba({PRGBA}, .35);
      cursor:pointer;
    }}

    /* 입력/버튼 대비 */
    .stTextInput input, .stNumberInput input, .stDateInput input, textarea {{
      background:{('#0b121f' if dark else '#ffffff')} !important;
      color:{fg} !important;
      border:1px solid {border} !important;
    }}
    .stButton > button {{
      background:{('#0b121f' if dark else '#ffffff')} !important;
      color:{fg} !important;
      border:1px solid {border} !important;
      border-radius:10px !important;
    }}
    .stButton [type="primary"], .stDownloadButton [type="primary"] {{
      background:{PRIMARY} !important; color:#fff !important; border:1px solid {PRIMARY} !important;
    }}

    /* Segmented control */
    [data-testid="stSegmentedControl"] label {{
      border:1px solid {border}; background:{card}; color:{fg};
    }}
    [data-testid="stSegmentedControl"] label[data-selected="true"] {{
      background:{PRIMARY} !important; color:#ffffff !important; border-color:{PRIMARY} !important;
    }}

    /* 캘린더 */
    table.calendar {{ width:100%; border-collapse:separate; border-spacing:6px; }}
    table.calendar td {{
      vertical-align:top; padding:8px; height:90px;
      background:{card}; border:1px solid {border}; border-radius:10px;
    }}
    .chip {{ display:inline-block; padding:2px 6px; font-size:11px; border-radius:6px; background:{PRIMARY}; color:#fff; }}
    .muted {{ color:{('#94a3b8' if dark else '#6b7280')}; }}

    /* 다크 하드닝 */
    p, li, span, label, h1, h2, h3, h4, h5, h6, a {{ color: {fg} !important; }}
    a {{ text-decoration: none; border-bottom: 1px dashed rgba(0,0,0,0); }}
    a:hover {{ border-bottom-color: currentColor; }}
    [data-testid="stCaptionContainer"], .muted {{ color: {('#9fb5b0' if dark else '#6b7280')} !important; }}
    .stTextInput label, .stNumberInput label, .stDateInput label,
    .stSelectbox label, .stRadio label, .stCheckbox label {{ color: {fg} !important; }}
    input::placeholder, textarea::placeholder {{ color: {('#94a3b8' if dark else '#9ca3af')} !important; opacity: .9; }}
    [data-testid="stMetricLabel"], [data-testid="stMetricDelta"] {{ color: {fg} !important; opacity: .85; }}
    [data-testid="stMetricValue"] {{ color: {fg} !important; }}
    details > summary {{ color: {fg} !important; }}
    .stSelectbox [role="button"],
    .stSelectbox [data-baseweb="select"] div {{ color: {fg} !important; }}
    </style>
    """, unsafe_allow_html=True)

def apply_plotly_theme(fig, dark: bool):
    if dark:
        fig.update_layout(template="plotly_dark", paper_bgcolor="rgba(0,0,0,0)",
                          plot_bgcolor="rgba(0,0,0,0)", font=dict(color="#e6e9ef"),
                          xaxis=dict(gridcolor="rgba(255,255,255,.08)"),
                          yaxis=dict(gridcolor="rgba(255,255,255,.08)"))
    else:
        fig.update_layout(template="plotly_white", paper_bgcolor="rgba(0,0,0,0)",
                          plot_bgcolor="rgba(0,0,0,0)", font=dict(color="#0f172a"),
                          xaxis=dict(gridcolor="rgba(0,0,0,.06)"),
                          yaxis=dict(gridcolor="rgba(0,0,0,.06)"))

# 최초 CSS 주입(초기 테마 적용)
inject_css(ss.dark, ss.big, ss.theme)

# -----------------------------
# 로고 pill (중앙)
# -----------------------------
def brand_badge():
    try:
        logo_path = Path(r"오당탕탕.png")  # 로고 경로
        if logo_path.exists():
            b64_img = base64.b64encode(logo_path.read_bytes()).decode("utf-8")
            img_html = f'<img src="data:image/png;base64,{b64_img}" alt="오당탕탕" style="height:80px;width:auto;display:block;"/>'
        else:
            img_html = "<strong>오당탕탕</strong>"
    except Exception:
        img_html = "<strong>오당탕탕</strong>"

    st.markdown(
        f"""
        <div style='display:flex;justify-content:center'>
          <div class='pill'>{img_html}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

# -----------------------------
# 유틸
# -----------------------------
def status_of(glucose: float) -> str:
    if glucose < 100:  return "정상"
    if glucose < 140:  return "경계"
    return "위험"

def status_color(status: str) -> str:
    return {"정상": "#16a34a", "경계": "#ca8a04"}.get(status, "#dc2626")

def month_grid(year: int, month: int) -> list[list[int | str]]:
    first = date(year, month, 1)
    start_weekday = (first.weekday() + 1) % 7  # 일요일 시작
    last_day = (first.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
    days = last_day.day
    cells, d = [], 1
    for _ in range(6):
        row = []
        for c in range(7):
            if len(cells) == 0 and c < start_weekday:
                row.append("")
            elif d <= days:
                row.append(d); d += 1
            else:
                row.append("")
        cells.append(row)
    return cells

def map_url(lat: float, lon: float) -> str:
    return (f"https://www.openstreetmap.org/export/embed.html?"
            f"bbox={lon-0.02}%2C{lat-0.02}%2C{lon+0.02}%2C{lat+0.02}"
            f"&layer=mapnik&marker={lat}%2C{lon}")

def show_loading_pill():
    runner_svg = """
    <svg class="runner" viewBox="0 0 24 24" width="18" height="18"
         fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="7" cy="5" r="2.5"></circle>
      <path d="M7 8 l3 2 l2 -1" />
      <path d="M10 10 l-2 3" />
      <path d="M10 10 l3 2" />
    </svg>"""
    st.markdown(
        f"<div class='loading-pill'>{runner_svg}<span style='margin-left:8px'>로딩 중...</span></div>",
        unsafe_allow_html=True,
    )

# -----------------------------
# 최초 로딩
# -----------------------------
if not ss.boot_done:
    holder = st.empty()
    with holder.container():
        show_loading_pill()
    time.sleep(1.0)
    holder.empty()
    ss.boot_done = True

# -----------------------------
# 헤더(로고 중앙) + 우측 토글/테마 선택
# -----------------------------
colL, colC, colR = st.columns([1, 2, 1])

with colC:
    brand_badge()

with colR:
    t1, t2 = st.columns(2)
    with t1:
        ss.big = st.toggle("큰글씨", value=ss.big, key="big_t")
    with t2:
        ss.dark = st.toggle("다크모드", value=ss.dark, key="dark_t")
    ss.theme = st.segmented_control(
    "테마",
    options=["딥 그린", "틸", "스카이", "연한 레드", "진한 레드", "보라"],
    key="theme_ctl",
    default=ss.theme,
)


# 토글/테마 반영 → 팔레트 재주입
inject_css(ss.dark, ss.big, ss.theme)
st.divider()

# 네비 (헤더 아래)
st.segmented_control("페이지", options=["홈", "내 페이지"], key="page")

# 편의: 현재 테마 색(배지용)
TC = _theme_colors(ss.theme)

# -----------------------------
# 홈
# -----------------------------
if ss.page == "홈":
    a, b, c = st.columns([1, 1, 1])

    with a:
        st.markdown("<div class='title'>프로필</div>", unsafe_allow_html=True)
        col = st.columns([1, 2])
        with col[0]:
            st.markdown("<div style='width:64px;height:64px;border-radius:999px;background:linear-gradient(135deg,#14b8a6,#0f766e);'></div>", unsafe_allow_html=True)
        with col[1]:
            st.write(ss.profile["name"])
            st.caption("건강 등급: B")
        if st.button("내 프로필 보기", use_container_width=True):
            ss.navigate_to = "내 페이지"
            st.rerun()

    with b:
        st.markdown("<div class='title'>오늘의 혈당</div>", unsafe_allow_html=True)
        blood = 132
        st.markdown(f"<h2 style='color:{status_color(status_of(blood))};margin:0'>{blood}</h2>", unsafe_allow_html=True)
        st.caption(f"상태: {status_of(blood)}")
        week_df = pd.DataFrame({"day":["월","화","수","목","금","토","일"], "value":[110,128,140,120,150,135,118]})
        fig = px.line(week_df, x="day", y="value")
        fig.update_traces(mode="lines", line_shape="spline", line=dict(width=3))
        fig.update_layout(showlegend=False, height=180, margin=dict(l=6,r=6,t=6,b=6), xaxis_title=None, yaxis_title=None)
        apply_plotly_theme(fig, ss.dark)
        st.plotly_chart(fig, use_container_width=True)

    with c:
        st.markdown("<div class='title'>운동 장소 지도</div>", unsafe_allow_html=True)
        btns = st.columns(4)
        cities = [("서울",37.5665,126.978),("부산",35.1796,129.0756),("대구",35.8714,128.6014),("인천",37.4563,126.7052)]
        for i,(n,la,lo) in enumerate(cities):
            with btns[i]:
                if st.button(n, use_container_width=True):
                    ss.city, ss.coords = n, {"lat":la, "lon":lo}
        st.caption(f"현재 선택: {ss.city}")
        url = map_url(ss.coords["lat"], ss.coords["lon"])
        st.components.v1.html(f'<iframe src="{url}" style="width:100%;height:180px;border:0;border-radius:10px"></iframe>',
                              height=185, scrolling=False)

    # 콘텐츠
    st.markdown("<div class='title'>운동 관련 콘텐츠</div>", unsafe_allow_html=True)
    box = st.columns(3)
    for i in range(3):
        with box[i]:
            st.markdown("<div class='card' style='height:120px;display:flex;align-items:center;justify-content:center'>플레이스홀더</div>", unsafe_allow_html=True)
    st.caption("스크래핑 연동 예정")

    # 상품
    st.markdown("<div class='title'>추천 상품</div>", unsafe_allow_html=True)
    cols = st.columns(4)
    items = [("저당 스낵 A","식이섬유 UP",True),("저당 스낵 B","당류 낮음",True),("활동 트래커","만보기/심박",False),("저GI 식단 키트","일주일분",False)]
    for i,(t,cap,aff) in enumerate(items):
        with cols[i]:
            badge = f"<span style='position:absolute;top:8px;left:8px;background:{TC['PRIMARY']};color:#fff;padding:2px 6px;border-radius:6px;font-size:12px'>제휴</span>" if aff else ""
            st.markdown(f"<div class='card' style='position:relative'><div style='height:96px;background:#e5e7eb;border-radius:10px;margin-bottom:8px'></div>{badge}<div>{t}</div><div class='muted'>{cap}</div></div>", unsafe_allow_html=True)

# -----------------------------
# 내 페이지
# -----------------------------
else:
    L, C, R = st.columns([1.1, 2.2, 1.1])

    with L:
        st.markdown("<div class='title'>프로필</div>", unsafe_allow_html=True)
        st.markdown("<div style='width:96px;height:96px;border-radius:999px;background:linear-gradient(135deg,#14b8a6,#0f766e);margin-bottom:8px'></div>", unsafe_allow_html=True)
        p = ss.profile
        p["name"]   = st.text_input("이름", value=p["name"])
        p["height"] = st.number_input("키(cm)", value=p["height"], step=1)
        p["weight"] = st.number_input("몸무게(kg)", value=p["weight"], step=1)
        p["waist"]  = st.number_input("허리둘레(cm)", value=p["waist"], step=1)
        st.metric("BMI", f"{p['weight']/((p['height']/100)**2):.1f}")
        ss.profile = p

    with C:
        st.markdown("<div class='title'>오늘 혈당 추이</div>", unsafe_allow_html=True)
        day_df = pd.DataFrame({"t":["06:00","09:00","12:00","15:00","18:00","21:00"], "v":[98,120,140,130,150,125]})
        fig2 = px.line(day_df, x="t", y="v")
        fig2.update_traces(mode="lines+markers", line=dict(width=3), marker=dict(size=6))
        fig2.update_layout(height=260, margin=dict(l=6,r=6,t=6,b=6), xaxis_title=None, yaxis_title=None)
        apply_plotly_theme(fig2, ss.dark)
        st.plotly_chart(fig2, use_container_width=True)

        # 입력 + 달력
        st.write("")
        st.markdown("<div class='title'>자가테스트 달력</div>", unsafe_allow_html=True)

        c_in = st.columns(3)
        with c_in[0]:
            in_date = st.date_input("날짜", value=date.today(), key="entry_date")
        with c_in[1]:
            in_glu  = st.number_input("혈당(mg/dL)", min_value=0, max_value=500, step=1, key="entry_glu")
        with c_in[2]:
            in_note = st.text_input("메모", key="entry_note")
        if st.button("저장"):
            k = in_date.strftime("%Y-%m-%d")
            ss.entries[k] = {"glucose": int(in_glu), "note": in_note}
            st.success(f"저장됨: {k} → {int(in_glu)} mg/dL")

        today = date.today()
        yy = st.number_input("연도", value=today.year, step=1, key="cal_year")
        mm = st.number_input("월", min_value=1, max_value=12, value=today.month, step=1, key="cal_month")
        grid = month_grid(int(yy), int(mm))
        month_prefix = f"{int(yy)}-{int(mm):02d}-"

        html = ["<table class='calendar'>",
                "<tr class='muted'><td>일</td><td>월</td><td>화</td><td>수</td><td>목</td><td>금</td><td>토</td></tr>"]
        for row in grid:
            html.append("<tr>")
            for cell in row:
                if cell == "":
                    html.append("<td></td>")
                else:
                    key = f"{int(yy)}-{int(mm):02d}-{int(cell):02d}"
                    g = ss.entries.get(key, {}).get("glucose")
                    note = ss.entries.get(key, {}).get("note", "")
                    chip = f"<span class='chip'>{g}</span>" if g is not None else ""
                    note_html = f"<div class='muted' style='margin-top:4px;font-size:12px'>{note}</div>" if note else ""
                    html.append(f"<td><div class='muted' style='font-size:12px'>{cell}</div>{chip}{note_html}</td>")
            html.append("</tr>")
        html.append("</table>")
        st.markdown("".join(html), unsafe_allow_html=True)

        same = [{"날짜":k, "혈당":v["glucose"], "메모":v.get("note","")} 
                for k,v in sorted(ss.entries.items()) if k.startswith(month_prefix)]
        if same:
            st.write(""); st.caption("이 달의 기록"); st.table(pd.DataFrame(same))
        else:
            st.info("이 달에는 저장된 기록이 없습니다.")

    with R:
        st.markdown("<div class='title'>오늘 먹은 것</div>", unsafe_allow_html=True)
        r = st.columns([3,1])
        with r[0]:
            txt = st.text_input("추가 (예: 오트밀, 샐러드)", key="food_in")
        with r[1]:
            if st.button("추가", type="primary"):
                t = (txt or "").strip()
                if t: ss.foods.insert(0, t); ss.food_in = ""
        if ss.foods:
            st.write("")
            for it in ss.foods:
                st.markdown(f"- {it}")
        else:
            st.caption("아직 기록이 없어요")

# -----------------------------
# 하단 FAB
# -----------------------------
st.markdown("<div class='chat-fab'>💬 챗봇</div>", unsafe_allow_html=True)
