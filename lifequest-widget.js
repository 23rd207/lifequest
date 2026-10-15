// ライフクエスト ウィジェット(Scriptable 用)
// ウィジェットをタップすると、このスクリプトがゲームを開きます。
// セーブデータはこのスクリプトと共有なので、遊んだ結果がそのままウィジェットに出ます。
// icon-color: deep-blue; icon-glyph: magic;

const GAME_URL = "https://23rd207.github.io/lifequest/";
const DAY_START = 4;
const WEEK_GOAL = 20;
const C = {
  sky: new Color("#0b0e2b"), ink: new Color("#f3f1ff"), dim: new Color("#a3a8dc"),
  gold: new Color("#ffd45e"), danger: new Color("#ff7b86"),
  body: new Color("#ff8a6b"), int: new Color("#6fbcff"), mind: new Color("#bb93ff"), bond: new Color("#6fe0a6")
};
const WINDOWS = { morning:{from:5,to:11}, night:{from:19,to:28} };
const POOL = [
  {id:"m1",t:"起きたら水を一杯飲む",s:"body",d:1,w:"morning"},
  {id:"m2",t:"朝日を5分あびる",s:"mind",d:1,w:"morning"},
  {id:"m3",t:"朝ごはんを食べる",s:"body",d:1,w:"morning"},
  {id:"m4",t:"布団をととのえる",s:"mind",d:1,w:"morning"},
  {id:"m5",t:"今日やることを3つ決める",s:"int",d:2,w:"morning"},
  {id:"a1",t:"10分以上あるく",s:"body",d:2,w:"any"},
  {id:"a2",t:"スクワットを20回",s:"body",d:2,w:"any"},
  {id:"a3",t:"ストレッチを5分",s:"body",d:1,w:"any"},
  {id:"a4",t:"本を10ページ読む",s:"int",d:2,w:"any"},
  {id:"a5",t:"気になったことを1つ調べる",s:"int",d:1,w:"any"},
  {id:"a6",t:"新しい単語を3つ覚える",s:"int",d:2,w:"any"},
  {id:"a7",t:"誰かに「ありがとう」を言う",s:"bond",d:1,w:"any"},
  {id:"a8",t:"家族か友だちに連絡する",s:"bond",d:2,w:"any"},
  {id:"a9",t:"部屋を5分かたづける",s:"mind",d:1,w:"any"},
  {id:"a10",t:"野菜を食べる",s:"body",d:1,w:"any"},
  {id:"a11",t:"25分間ひとつのことに集中する",s:"int",d:3,w:"any"},
  {id:"a12",t:"5分間 深呼吸だけする",s:"mind",d:1,w:"any"},
  {id:"a13",t:"いつもと違う道を通る",s:"mind",d:1,w:"any"},
  {id:"a14",t:"人のいいところを1つ伝える",s:"bond",d:2,w:"any"},
  {id:"a15",t:"水を1.5L以上飲む",s:"body",d:2,w:"any"},
  {id:"a16",t:"後回しにしていたことを1つ片づける",s:"mind",d:3,w:"any"},
  {id:"a17",t:"30分 運動する",s:"body",d:3,w:"any"},
  {id:"n1",t:"今日よかったことを3つ書く",s:"mind",d:2,w:"night"},
  {id:"n2",t:"寝る30分前にスマホを置く",s:"mind",d:3,w:"night"},
  {id:"n3",t:"明日の予定を確認する",s:"int",d:1,w:"night"},
  {id:"n4",t:"湯船につかる",s:"body",d:1,w:"night"},
  {id:"n5",t:"日付が変わる前にふとんに入る",s:"body",d:3,w:"night"}
];
const TITLES = [[1,"村人"],[3,"見習い冒険者"],[6,"冒険者"],[10,"熟練の旅人"],[15,"勇者"],[20,"伝説の勇者"],[30,"人生の賢者"]];

/* ---- ゲームと同じ計算 ---- */
const pad = n => String(n).padStart(2, "0");
function hm(ms){ const d = new Date(ms); return pad(d.getHours()) + ":" + pad(d.getMinutes()); }
function ymd(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
function gameDate(now){ return new Date(now.getTime() - DAY_START*3600e3); }
function today(now){ return ymd(gameDate(now)); }
function weekKey(now){ const d=gameDate(now); d.setDate(d.getDate()-(d.getDay()+6)%7); return ymd(d); }
function gameHour(now){ const h = now.getHours()+now.getMinutes()/60; return h < DAY_START ? h+24 : h; }
function nextReset(now){ const n = new Date(now); n.setHours(DAY_START,0,0,0); if (n <= now) n.setDate(n.getDate()+1); return n; }
function hash(s){ let h=2166136261; for (const c of s){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); } return h>>>0; }
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function pick(arr,n,r){ const a=arr.slice(); const out=[]; while(out.length<n&&a.length){ out.push(a.splice(Math.floor(r()*a.length),1)[0]); } return out; }
function dailyFor(date){
  const r = rng(hash("lq"+date));
  const by = w => POOL.filter(q => q.w === w);
  return [...pick(by("morning"),1,r), ...pick(by("any"),3,r), ...pick(by("night"),1,r)].map(q => q.id);
}
const need = l => 40 + l*20;
function levelInfo(xp){ let l=1,x=xp; while(x>=need(l)){ x-=need(l); l++; } return {lv:l,cur:x,need:need(l)}; }
function titleFor(lv){ let t=TITLES[0][1]; for (const [l,n] of TITLES) if (lv>=l) t=n; return t; }
function periodKey(r, ds){
  if (r === "weekly"){ const [y,m,d]=ds.split("-").map(Number); const dt=new Date(y,m-1,d); dt.setDate(dt.getDate()-(dt.getDay()+6)%7); return ymd(dt); }
  if (r === "monthly") return ds.slice(0,7);
  if (r === "once") return "once";
  return ds;
}
function questState(q, now){
  if (q.w === "any") return "open";
  const w = WINDOWS[q.w], h = gameHour(now);
  if (h < w.from) return "locked";
  if (h >= w.to) return "expired";
  return "open";
}

/* ---- セーブデータ(ゲームと共有) ---- */
const fm = FileManager.local();
const dir = fm.documentsDirectory();
const SAVE = fm.joinPath(dir, "lifequest-save.json");
const HTML_CACHE = fm.joinPath(dir, "lifequest-game.html");
function loadSave(){ try { return fm.fileExists(SAVE) ? fm.readString(SAVE) : null; } catch(e){ return null; } }
function writeSave(str){ try { JSON.parse(str); fm.writeString(SAVE, str); } catch(e){} }

/* ---- iPhoneのカレンダー(シフトボード・TimeTree などが書き込んだ予定も含む) ---- */
const SKIP_CAL = /祝日|休日|Holiday|誕生日|Birthday/i;
const SHIFT_RE = /シフト|バイト|出勤|勤務|shift/i;
async function todayEvents(){
  try {
    const now = new Date();
    const start = gameDate(now); start.setHours(DAY_START, 0, 0, 0);
    const end = new Date(start.getTime() + 24*3600e3);
    const evs = await CalendarEvent.between(start, end, []);
    return evs.filter(e => !SKIP_CAL.test(e.calendar ? e.calendar.title : ""))
      .filter(e => e.endDate.getTime() > start.getTime())
      .slice(0, 12)
      .map(mapEvent);
  } catch(e) { return null; }
}
function mapEvent(e){
  return { id: e.identifier, title: e.title, start: e.startDate.getTime(), end: e.endDate.getTime(),
    allDay: e.isAllDay, cal: e.calendar ? e.calendar.title : "" };
}
// こよみ画面用:先月の1日〜再来月の1日まで
async function monthEvents(){
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth()-1, 1);
    const end = new Date(now.getFullYear(), now.getMonth()+2, 1);
    const evs = await CalendarEvent.between(start, end, []);
    return evs.filter(e => !/誕生日|Birthday/i.test(e.calendar ? e.calendar.title : "")).slice(0, 400).map(mapEvent);
  } catch(e) { return null; }
}

/* ---- リマインダー(今日が期限・期限切れ・今日完了したもの) ---- */
const remMap = new Map();
async function loadReminders(){
  try {
    const now = new Date();
    const gd = gameDate(now), gds = ymd(gd);
    const dayEnd = new Date(gd.getFullYear(), gd.getMonth(), gd.getDate()+1, DAY_START);
    const dueToday = r => {
      if (!r.dueDate) return false;
      return r.dueDateIncludesTime ? r.dueDate.getTime() < dayEnd.getTime() : ymd(r.dueDate) <= gds;
    };
    const overdue = r => r.dueDateIncludesTime ? r.dueDate.getTime() < now.getTime() : ymd(r.dueDate) < gds;
    const open = (await Reminder.allIncomplete()).filter(dueToday);
    let doneToday = [];
    try { doneToday = (await Reminder.completedToday()).filter(r => !r.dueDate || dueToday(r)); } catch(e) {}
    const all = open.concat(doneToday).slice(0, 25);
    remMap.clear();
    return all.map(r => {
      remMap.set("r" + hash(String(r.identifier)).toString(36), r);
      return { id: r.identifier, title: r.title, due: r.dueDate ? r.dueDate.getTime() : null,
        hasTime: !!r.dueDateIncludesTime, overdue: !r.isCompleted && !!r.dueDate && overdue(r),
        list: r.calendar ? r.calendar.title : "", priority: r.priority || 0, completed: !!r.isCompleted };
    });
  } catch(e) { return null; }
}

/* ---- ゲームを開く ---- */
const wait = ms => new Promise(r => Timer.schedule(ms, false, r));
async function fetchGame(timeout){
  try {
    const req = new Request(GAME_URL + "?t=" + Date.now());
    req.timeoutInterval = timeout;
    const html = await req.loadString();
    if (html && html.includes("ライフクエスト") && html.includes("<head>")) { fm.writeString(HTML_CACHE, html); return html; }
  } catch(e) {}
  return null;
}
async function openGame(){
  // 保存済みの版ですぐ開く。なければダウンロードを待つ(初回だけ)
  let html = fm.fileExists(HTML_CACHE) ? fm.readString(HTML_CACHE) : null;
  const hadCache = !!html;
  if (!html) html = await fetchGame(10);
  if (!html) {
    const a = new Alert(); a.title = "ゲームを開けませんでした";
    a.message = "はじめの1回はインターネットにつながった状態で開いてください。"; a.addAction("OK"); await a.present();
    return;
  }
  const saved = loadSave();
  const [events, month, rems] = [await todayEvents(), await monthEvents(), await loadReminders()];
  let remCals = [];
  try {
    const def = await Calendar.defaultForReminders();
    remCals = [def].concat((await Calendar.forReminders()).filter(c => c.identifier !== def.identifier));
  } catch(e) {}
  const js = v => JSON.stringify(v).replace(/</g, "\\u003c");
  const boot = "<script>window.__LQ_HOST__='scriptable';window.__LQ_STATE__=" + js(saved)
    + ";window.__LQ_EVENTS__=" + js(events) + ";window.__LQ_MONTH__=" + js(month)
    + ";window.__LQ_REMS__=" + js(rems) + ";window.__LQ_REMLISTS__=" + js(remCals.map(c => c.title)) + ";</script>";
  html = html.replace("<head>", "<head>" + boot)
    // フォントの読み込みを待たずに表示する
    .replace(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/, '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'">');

  const wv = new WebView();
  let open = true;
  wv.loadHTML(html, GAME_URL);
  const shown = wv.present(false).then(() => { open = false; }, () => { open = false; });
  // 次回のために、裏で最新版を取っておく
  if (hadCache) fetchGame(10);
  // 1秒ごとに、ゲームのセーブと頼まれた操作を受け取る
  const TAKE = "(function(){var s=window.__lqPending||null;window.__lqPending=null;var o=window.__lqOps||[];window.__lqOps=[];return JSON.stringify({s:s,o:o});})()";
  async function drain(){
    let r = null;
    try { r = JSON.parse(await wv.evaluateJavaScript(TAKE, false)); } catch(e) { return; }
    if (r.s) writeSave(r.s);
    let added = false, remAdded = false;
    for (const op of r.o || []) {
      try {
        if (op.type === "rem") {
          const rem = remMap.get(op.id);
          if (rem) { rem.isCompleted = !!op.done; rem.save(); }
        } else if (op.type === "addRem") {
          const r = new Reminder();
          r.title = String(op.title || "リマインダー");
          if (op.due) { r.dueDate = new Date(op.due); r.dueDateIncludesTime = !!op.hasTime; }
          r.priority = op.high ? 1 : 0;
          const cal = remCals.find(c => c.title === op.list) || remCals[0];
          if (cal) r.calendar = cal;
          r.save();
          remAdded = true;
        } else if (op.type === "addEvent") {
          const ev = new CalendarEvent();
          ev.title = String(op.title || "予定");
          ev.isAllDay = !!op.allDay;
          ev.startDate = new Date(op.start);
          ev.endDate = new Date(op.allDay ? op.start + 86399000 : op.end);
          ev.calendar = await Calendar.defaultForEvents();
          ev.save();
          added = true;
        }
      } catch(e) {}
    }
    if (remAdded) {
      try { const list = await loadReminders(); await wv.evaluateJavaScript("window.__lqSetRems(" + js(list) + ");0", false); } catch(e) {}
    }
    if (added) {
      try {
        const te = await todayEvents(), me = await monthEvents();
        await wv.evaluateJavaScript("window.__lqSetEvents(" + js(te) + "," + js(me) + ");0", false);
      } catch(e) {}
    }
  }
  while (open) { await wait(1000); await drain(); }
  await shown;
  await drain();
}

/* ---- ウィジェット ---- */
async function buildWidget(){
  const now = new Date();
  const t = today(now);
  let st = null; try { st = JSON.parse(loadSave() || "null"); } catch(e) {}
  const L = levelInfo(st ? st.xp || 0 : 0);
  const ids = st && st.daily && st.daily.date === t && st.daily.ids && st.daily.ids.length ? st.daily.ids : dailyFor(t);
  const done = new Set(st && st.daily && st.daily.date === t ? Object.keys(st.daily.done || {}) : []);
  const quests = ids.map(id => POOL.find(p => p.id === id)).filter(Boolean);
  const nDone = quests.filter(q => done.has(q.id)).length;
  const evsRaw = await todayEvents();
  const evs = evsRaw || [];
  const evDone = st && st.events && st.events.date === t ? st.events.done || {} : {};
  const evId = e => "e" + hash(String(e.id) + "|" + e.start).toString(36);
  const nextEv = evs.filter(e => !evDone[evId(e)] && (e.allDay || e.end > now.getTime()))
    .sort((a,b) => (a.allDay ? 0 : a.start) - (b.allDay ? 0 : b.start));
  const family = config.widgetFamily || "medium";
  const rs = (await loadReminders()) || [];
  const rDone = st && st.rems && st.rems.date === t ? st.rems.done || {} : {};
  const remsLeft = rs.filter(r => !r.completed && !rDone["r" + hash(String(r.id)).toString(36)]);
  // 今日のこのあとの予定(終わったものは出さない)
  const upcoming = evs.filter(e => e.allDay || e.end > now.getTime())
    .sort((a,b) => (a.allDay ? 0 : 1) - (b.allDay ? 0 : 1) || a.start - b.start);
  const streakAlive = st && st.streak && (st.streakDay === t || st.streakDay === ymd(new Date(gameDate(now).getTime() - 864e5)));
  const streak = streakAlive ? st.streak : 0;
  const week = st && st.week && st.week.key === weekKey(now) ? st.week.n : 0;
  const customs = st && Array.isArray(st.custom) ? st.custom.filter(c => !(c.r === "once" && c.doneOn && c.doneOn !== t))
    .map(c => ({ t:c.t, done: !!c.doneOn && periodKey(c.r, c.doneOn) === periodKey(c.r, t) })) : [];

  const w = new ListWidget();
  w.backgroundColor = C.sky;
  w.setPadding(12, 14, 12, 14);
  w.url = URLScheme.forRunningScript();
  w.refreshAfterDate = new Date(now.getTime() + 10*60e3);

  function text(stack, str, size, color, bold){
    const el = stack.addText(str);
    el.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size);
    el.textColor = color; el.lineLimit = 1; el.minimumScaleFactor = 0.7;
    return el;
  }
  function bar(stack, ratio, size){
    const cells = 10, n = Math.round(Math.max(0, Math.min(1, ratio))*cells);
    const el = stack.addText("■".repeat(n) + "□".repeat(cells-n));
    el.font = Font.systemFont(size); el.textColor = C.gold; el.lineLimit = 1;
  }
  function statusBlock(stack){
    text(stack, titleFor(L.lv), 10, C.gold);
    text(stack, st && st.name ? st.name : "ゆうしゃ", 15, C.ink, true);
    const row = stack.addStack(); row.centerAlignContent();
    text(row, "Lv ", 10, C.dim); text(row, String(L.lv), 22, C.ink, true);
    bar(stack, L.cur/L.need, 8);
    stack.addSpacer(3);
    text(stack, (st ? st.gold || 0 : 0)+"G ・ 連続"+streak+"日", 10, C.dim);
    const rr = stack.addStack(); rr.centerAlignContent();
    text(rr, "リセット ", 10, C.dim);
    const d = rr.addDate(nextReset(now)); d.applyTimerStyle(); d.font = Font.mediumMonospacedSystemFont(10); d.textColor = C.ink;
  }
  function questLine(stack, q){
    const s = done.has(q.id) ? "done" : questState(q, now);
    const row = stack.addStack(); row.centerAlignContent(); row.spacing = 5;
    text(row, { done:"✔", open:"▶", locked:"…", expired:"×" }[s], 11, { done:C.gold, open:C[q.s] || C.ink, locked:C.dim, expired:C.danger }[s], true);
    text(row, q.t, 12, s === "open" ? C.ink : C.dim, s === "open");
  }

  function eventLine(stack, e, size){
    const row = stack.addStack(); row.centerAlignContent(); row.spacing = 6;
    const shift = SHIFT_RE.test(e.title || "") || SHIFT_RE.test(e.cal || "");
    const isDone = !!evDone[evId(e)];
    const nowIn = !e.allDay && e.start <= now.getTime() && e.end > now.getTime();
    const tm = row.addText(e.allDay ? "終日 " : hm(e.start));
    tm.font = Font.mediumMonospacedSystemFont(size - 1); tm.textColor = shift ? C.gold : (nowIn ? C.ink : C.dim); tm.lineLimit = 1;
    text(row, (isDone ? "✔ " : "") + (e.title || "予定"), size, isDone ? C.dim : C.ink, !isDone && nowIn);
    if (nowIn) text(row, "いま", 9, C.gold, true);
  }
  function eventsBlock(max, size){
    const head = w.addStack(); head.centerAlignContent();
    text(head, "今日の予定", 11, C.gold, true);
    head.addSpacer();
    const d = new Date(now);
    text(head, (d.getMonth()+1) + "/" + d.getDate() + "(" + "日月火水木金土"[d.getDay()] + ")", 10, C.dim);
    w.addSpacer(4);
    if (!upcoming.length) text(w, evsRaw ? "このあとの予定はありません" : "タップしてカレンダーを許可してください", size - 1, C.dim);
    for (const e of upcoming.slice(0, max)) { eventLine(w, e, size); w.addSpacer(2); }
    if (upcoming.length > max) text(w, "ほか " + (upcoming.length - max) + "件", 9, C.dim);
  }
  function footer(){
    const row = w.addStack(); row.centerAlignContent(); row.spacing = 6;
    text(row, "Lv" + L.lv, 12, C.ink, true);
    bar(row, L.cur/L.need, 7);
    row.addSpacer();
    text(row, "デイリー " + nDone + "/" + quests.length, 10, nDone === quests.length ? C.gold : C.dim);
  }
  function footer2(){
    const row = w.addStack(); row.centerAlignContent(); row.spacing = 4;
    text(row, (st ? st.gold || 0 : 0) + "G ・ 連続" + streak + "日" + (remsLeft.length ? " ・ リマインダー" + remsLeft.length : ""), 10, C.dim);
    row.addSpacer();
    const d = row.addDate(nextReset(now)); d.applyTimerStyle(); d.font = Font.mediumMonospacedSystemFont(10); d.textColor = C.dim; d.rightAlignText();
  }

  if (family === "small") {
    eventsBlock(2, 12);
    w.addSpacer();
    footer();
  } else if (family === "medium") {
    eventsBlock(3, 13);
    w.addSpacer();
    footer();
    w.addSpacer(2);
    footer2();
  } else {
    eventsBlock(4, 13);
    w.addSpacer(10);
    const main = w.addStack(); main.spacing = 12;
    const left = main.addStack(); left.layoutVertically(); left.size = new Size(110, 0);
    statusBlock(left);
    const right = main.addStack(); right.layoutVertically(); right.spacing = 4;
    text(right, "デイリーミッション " + nDone + "/" + quests.length, 10, C.dim);
    for (const q of quests) questLine(right, q);
    if (remsLeft.length) {
      w.addSpacer(8);
      text(w, "リマインダー のこり" + remsLeft.length + "件", 10, C.dim);
      for (const r of remsLeft.slice(0, 3)) {
        const row = w.addStack(); row.spacing = 5;
        text(row, r.overdue ? "!" : "▶", 11, r.overdue ? C.danger : C.ink, true);
        text(row, r.title || "リマインダー", 12, C.ink);
      }
    }
    w.addSpacer(6);
    const wk = w.addStack(); wk.centerAlignContent(); wk.spacing = 6;
    text(wk, "ウィークリー " + Math.min(week, WEEK_GOAL) + "/" + WEEK_GOAL, 10, C.dim);
    bar(wk, week/WEEK_GOAL, 8);
    w.addSpacer();
  }
  if (!st) text(w, "タップして冒険をはじめる", 9, C.dim);
  return w;
}

if (config.runsInWidget) {
  Script.setWidget(await buildWidget());
} else {
  try { await openGame(); }
  catch(e) {
    const a = new Alert(); a.title = "エラーが起きました"; a.message = String(e); a.addAction("OK"); await a.present();
  }
}
Script.complete();
