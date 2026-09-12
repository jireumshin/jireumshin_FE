// 사건 표시용 유틸 — 결과 화면·(추후)대시보드 공용

const EMOJI_MAP = [
  [/헤드폰|이어폰|에어팟|버즈|헤드셋/, "🎧"],
  [/신발|운동화|러닝화|스니커|구두/, "👟"],
  [/키보드/, "⌨️"],
  [/마우스/, "🖱️"],
  [/커피|카페|원두|캡슐|머신/, "☕"],
  [/텀블러|보틀|물병/, "🥤"],
  [/노트북|맥북|랩탑/, "💻"],
  [/아이폰|갤럭시|스마트폰|휴대폰|핸드폰/, "📱"],
  [/아이패드|태블릿/, "📲"],
  [/가방|백팩|파우치|지갑/, "🎒"],
  [/옷|자켓|코트|후드|티셔츠|맨투맨|니트|패딩/, "👕"],
  [/시계|워치/, "⌚"],
  [/게임|콘솔|플스|엑박|닌텐도|스위치/, "🎮"],
  [/카메라|렌즈/, "📷"],
  [/책|도서/, "📚"],
  [/화장품|향수|스킨|립|섀도우/, "💄"],
  [/의자|책상|가구|조명/, "🪑"],
];

export function guessEmoji(name = "") {
  for (const [re, emoji] of EMOJI_MAP) if (re.test(name)) return emoji;
  return "🛍️";
}

// 배심원 이름 → 캐릭터 아바타 (홈·기소와 동일 매핑)
const JUROR_AVATARS = [
  [/가성비/, { img: "/assets/value-fairy.png", soft: "#F0F8E8" }],
  [/텅장|지킴/, { img: "/assets/wallet-guardian.png", soft: "#EAF2FE" }],
  [/지름/, { img: "/assets/impluse-fairy.png", soft: "#FFF0F3" }],
  [/팩트|봇/, { img: "/assets/fact-bot.png", soft: "#F0EEFC" }],
];

export function jurorAvatar(name = "") {
  for (const [re, a] of JUROR_AVATARS) if (re.test(name)) return a;
  return null;
}

export function formatWon(n) {
  return `${Number(n || 0).toLocaleString("ko-KR")}원`;
}

// 상대 시간 표기 — 예: '오늘', '3일 전', '2주 전'
export function relativeDay(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

// 변론(설득) 게임 — 게이지 임계·라운드 (BE defense.service와 동일)
export const GAUGE_THRESHOLD = 50;
export const BASE_DEFENSE_ROUNDS = 3; // 기본 라운드
export const MAX_DEFENSE_ROUNDS = 5; // 2:2 동점이면 여기까지 연장
const INITIAL_GAUGE = { GUILTY: 35, NOT_GUILTY: 65 };

// 변론 진행 상태 — 남은 라운드·연장전 여부. defenseRounds>=3인데 아직 안 닫혔으면 동점 연장 중.
export function defenseInfo(trial) {
  const used = trial?.defenseRounds ?? 0;
  const closed = !!trial?.defenseClosed;
  const inExtension = !closed && used >= BASE_DEFENSE_ROUNDS;
  const cap = inExtension ? MAX_DEFENSE_ROUNDS : BASE_DEFENSE_ROUNDS;
  const roundsLeft = closed ? 0 : Math.max(0, cap - used);
  return { used, closed, inExtension, roundsLeft };
}

// 배심원 게이지 목록 — trial.gauges가 없으면(변론 전) 표에서 초기값 파생. 표시용.
export function gaugesFor(trial) {
  const jury = Array.isArray(trial?.jury) ? trial.jury : [];
  const stored =
    trial?.gauges && typeof trial.gauges === "object" ? trial.gauges : null;
  return jury.map((j) => ({
    juror: j.juror,
    emoji: j.emoji,
    vote: j.vote,
    gauge: Math.round(stored?.[j.juror] ?? INITIAL_GAUGE[j.vote] ?? 50),
  }));
}

// 배심원 평결에서 몇 대 몇인지 — 예: { guilty: 3, notGuilty: 1, label: '3 : 1 유죄' }
export function tally(jury = [], verdict) {
  const guilty = jury.filter((j) => j.vote === "GUILTY").length;
  const notGuilty = jury.length - guilty;
  const win = verdict === "GUILTY" ? guilty : notGuilty;
  const lose = verdict === "GUILTY" ? notGuilty : guilty;
  const word = verdict === "GUILTY" ? "유죄" : "무죄";
  return { guilty, notGuilty, label: `${win} : ${lose} ${word}` };
}
