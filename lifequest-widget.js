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
const TITLES = [[1, "村人"], [3, "旅立ちの若者"], [6, "見習い冒険者"], [10, "冒険者"], [15, "熟練の旅人"], [20, "騎士"], [30, "勇者"], [40, "英雄"], [50, "伝説の勇者"], [65, "星を継ぐ者"], [80, "人生の賢者"], [100, "人生を極めし者"]];
// 階級ごとのドット絵(16x16)。1文字 = 1ドット、"." は透明
const SPRITE_PAL = {"K": "#1a1030", "S": "#ffcf9e", "s": "#e0a070", "H": "#6b3f1f", "h": "#4a2a14", "B": "#5a3a28", "b": "#3e271a", "W": "#e6e9f8", "w": "#9aa0c0", "T": "#8a5a2c", "G": "#ffd45e", "g": "#c99a2e", "A": "#fff6c8", "M": "#bb93ff", "m": "#7d5ad0", "R": "#e04a5a", "r": "#a8303e", "N": "#2a2f6e", "n": "#1b1f4a", "Y": "#ffffff", "O": "#6fbcff", "o": "#3c7fcf", "L": "#7fbf6a", "l": "#4f8a44", "U": "#c9a77a", "u": "#9a7a52", "I": "#b8bfd8", "i": "#7f86a8", "V": "#f3f1ff", "v": "#c8c4e8"};
const SPRITES = [
  ["................", ".....KKKKKK.....", "....KHHHHHHK....", "...KHHHHHHHHK...", "...KHSSSSSSHK...", "...KSSKSSKSSK...", "...KSSKSSKSSK...", "...KsSSSSSSsK...", "....KSSssSSK....", ".....KKKKKK.....", "....KLLLLLLK....", "...KSLLLLLLSK...", "...KSKllllKSK...", "....KLLKKLLK....", "....KBBK.KBBK...", "....KKK...KKK..."],
  ["................", ".....KKKKKK.....", "....KHHHHHHK....", "...KHHHHHHHHK...", "...KHSSSSSSHK...", "...KSSKSSKSSK...", "...KSSKSSKSSKT..", "...KsSSSSSSsKTK.", "....KSSssSSKKTK.", ".....KKKKKK.KTK.", "....KOOOOOOKTK..", "...KSOOOOOOST...", "...KSKooooKST...", "....KOOKKOOKT...", "....KBBK.KBBK...", "....KKK...KKK..."],
  ["................", ".....KKKKKK.....", "....KHHHHHHK....", "...KHHHHHHHHK...", "...KHSSSSSSHK...", "...KSSKSSKSSK...", "...KSSKSSKSSKUK.", "...KsSSSSSSsKUK.", "....KSSssSSKKUK.", ".....KKKKKK.KUK.", "....KOOOOOOKTTTK", "...KSOOOOOOSKTK.", "...KSKooooKSK...", "....KOOKKOOK....", "....KBBK.KBBK...", "....KKK...KKK..."],
  ["................", ".....KKKKKK.....", "....KHHHHHHK....", "...KHHHHHHHHK...", "...KRRRRRRRRKK..", "...KSSKSSKSSKWK.", "...KSSKSSKSSKWK.", "...KsSSSSSSsKWK.", "....KSSssSSKKWK.", ".....KKKKKK.KWK.", "....KLLLLLLKGGGK", "...KSLLLLLLSKTK.", "...KSKllllKSK...", "....KLLKKLLK....", "....KBBK.KBBK...", "....KKK...KKK..."],
  ["................", "....KKKKKKKK....", "...KUUUUUUUUK...", "..KUUHHHHHHUUK..", "..KUHSSSSSSHUK..", "..KUSSKSSKSSKWK.", "..KUSSKSSKSSKWK.", "..KuKsSSSSsKKWK.", "....KSSssSSKKWK.", "...K.KKKKKKKKWK.", "..KuKUUUUUKKGGGK", "..KuSUUUUUuKKTK.", "..KuSKuuuuuKK...", "..KuKUUKKKuK....", "...KKBBK.KBKK...", "....KKK...KKK..."],
  ["................", "....KKKKKKKK....", "...KIIIIIIIIK...", "...KIIIIIIIIK...", "...KiIIIIIIiKK..", "...KSSKSSKSSKWK.", "...KSSKSSKSSKWK.", "...KsSSSSSSsKWK.", "....KSSssSSKKWK.", ".KK..KKKKKK.KWK.", "KOOKKIGGGGIKGGGK", "KOGOKIIIIIISKTK.", "KOOOKKiiiiKSK...", ".KOKKIIKKIIK....", "....KBBK.KBBK...", "....KKK...KKK..."],
  ["................", ".....KKKKKK.....", "....KHHKGKHK....", "...KGGGGGGGGK...", "...KHSSSSSSHKK..", "...KSSKSSKSSKWK.", "...KSSKSSKSSKWK.", "...KsSSSSSSsKWK.", "....KSSssSSKKWK.", ".KKK.KKKKKKKKWK.", "KRRKKOOOOOKKGGGK", "KRGRKOOOOORKKTK.", "KRRRKKoooorKK...", ".KRKKOOKKKrK....", "...KKBBK.KBKK...", "....KKK...KKK..."],
  ["................", ".....KKKKKK.....", "....KHHKGKHK....", "...KGGGGGGGGK...", "...KHSSSSSSHKK..", "...KSSKSSKSSKWK.", "...KSSKSSKSSKWK.", "...KsSSSSSSsKWK.", "....KSSssSSKKWK.", ".KKK.KKKKKKKKWK.", "KGGKKGGGGGGKGGGK", "KGRGKIIIIIRKKTK.", "KGGGKKiiiirKK...", ".KGKKGGKKGGK....", "...KKBBK.KBKK...", "....KKK...KKK..."],
  ["....K.K..K.K....", "A...KGKGGKGK...A", "....KGGGGGGK....", "...KGGRGGRGGA...", "A..KHSSSSSSHKWK.", "...KSSKSSKSAKWK.", "...KSSKSSKSSKWK.", "...KsSSSSSSsKWKA", "....KSSssSSKKWK.", ".KKK.KKKKKKKKWK.", "KGGKKGGGGGKKGGGK", "KGRGKGGGGGRKKGK.", "AGGGKKggggrKK...", ".KGKKGGKKKrK....", "...KKBBK.KBKK..A", "....KKK...KKK..."],
  ["....K.K..K.K....", "A...KIKIIKIK.G.A", "....KIIOIIIKGGG.", "...KHHHHHHHGGAGG", "A..KHSSSSSSHGGG.", "...KSSKSSKSGKT.G", "...KSSKSSKSSKT..", "...KsSSSSSSsKT.A", "....KSSssSSKKTK.", "...K.KKKKKKKKTK.", "..KNKNNNNNKKTK..", "..KYSNNNNNYKT...", "A.KnSKnnnnnKT...", "..KnKYNKKKnKT...", "...KKBBK.KBKT..A", "....KKK...KKK..."],
  [".......KK.......", ".....KKMMKK.KAK.", "....KKMMMMKKAMAK", "...KKMMMMMMKKAK.", "..KmmmmmmmmmmT..", "...KSSKSSKSSKT..", "...KSSKSSKSSKT..", "...KsSSSSSSsKT..", "....KYYYYYYKKTK.", "....KYYYYYYKKTK.", "....KKYYYYKKTK..", "...KSMMMMMMST...", "...KSKmmmmKST...", "...KMMMMMMMMT...", "...KmmmmmmmmT...", "...KKKKKKKKKK..."],
  ["A..AKAKAAKAK..A.", "....KGKGGKGK.G.K", "....KGGGGGGKGGG.", "...KGGRGGRGGGAGA", "...KHSSSSSSHGGG.", "...KSSKSSKSGKT.G", "A..KSSKSSKSSKT..", "...KsSSSSSSsKT..", "....KYYYYYYKKTK.", "....KYYYYYYKKTKA", "....KKYYYYKKTK..", "A..KSVVVVVVST...", "...KSKvvvvKST...", "...KVVVVVVVVT...", "...KvvGvvGvvT...", ".A.KKAKKKKAKK.A."]
];
const MAX_LV = 100;

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
function levelInfo(xp){ let l=1,x=xp; while(l<MAX_LV&&x>=need(l)){ x-=need(l); l++; }
  return l>=MAX_LV ? {lv:MAX_LV,cur:1,need:1} : {lv:l,cur:x,need:need(l)}; }
function rankIndex(lv){ let i=0; TITLES.forEach(([l],k) => { if (lv>=l) i=k; }); return i; }
// ドット絵を画像にする(1ドット = scale ピクセル)
function spriteImage(i, scale){
  const ctx = new DrawContext();
  ctx.size = new Size(16*scale, 16*scale); ctx.opaque = false; ctx.respectScreenScale = true;
  SPRITES[i].forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === ".") return;
    ctx.setFillColor(new Color(SPRITE_PAL[ch])); ctx.fillRect(new Rect(x*scale, y*scale, scale, scale));
  }));
  return ctx.getImage();
}
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
async function tomorrowEvents(){
  try {
    const now = new Date();
    const start = gameDate(now); start.setHours(DAY_START, 0, 0, 0); start.setDate(start.getDate() + 1);
    const end = new Date(start.getTime() + 24*3600e3);
    const evs = await CalendarEvent.between(start, end, []);
    return evs.filter(e => !SKIP_CAL.test(e.calendar ? e.calendar.title : ""))
      .sort((a,b) => (a.isAllDay ? 0 : 1) - (b.isAllDay ? 0 : 1) || a.startDate - b.startDate).map(mapEvent);
  } catch(e) { return []; }
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

/* ---- リマインダー(期限が2週間以内・期限切れ・今日完了したもの) ---- */
const REM_DAYS = 14;
const remMap = new Map();
async function loadReminders(){
  try {
    const now = new Date();
    const gd = gameDate(now), gds = ymd(gd);
    // 今日を含めて14日目の終わりまで
    const rangeEnd = new Date(gd.getFullYear(), gd.getMonth(), gd.getDate()+REM_DAYS, DAY_START);
    const lastDay = ymd(new Date(gd.getFullYear(), gd.getMonth(), gd.getDate()+REM_DAYS-1));
    const dueToday = r => {
      if (!r.dueDate) return false;
      return r.dueDateIncludesTime ? r.dueDate.getTime() < rangeEnd.getTime() : ymd(r.dueDate) <= lastDay;
    };
    const overdue = r => r.dueDateIncludesTime ? r.dueDate.getTime() < now.getTime() : ymd(r.dueDate) < gds;
    const open = (await Reminder.allIncomplete()).filter(dueToday);
    let doneToday = [];
    try { doneToday = (await Reminder.completedToday()).filter(r => !r.dueDate || dueToday(r)); } catch(e) {}
    const byDue = (a, b) => (a.dueDate ? a.dueDate.getTime() : 0) - (b.dueDate ? b.dueDate.getTime() : 0);
    const all = open.sort(byDue).slice(0, 40).concat(doneToday);
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
  // まず最新版を取りにいく(最大3秒)。電波が悪いときは保存済みの版で開く
  const hadCache = fm.fileExists(HTML_CACHE);
  let html = await fetchGame(hadCache ? 3 : 10);
  const fresh = !!html;
  if (!html && hadCache) html = fm.readString(HTML_CACHE);
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
  // 取れなかったときは、次回のために裏で取っておく
  if (!fresh) fetchGame(10);
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
    const top = stack.addStack(); top.centerAlignContent(); top.spacing = 6;
    const im = top.addImage(spriteImage(rankIndex(L.lv), 3)); im.imageSize = new Size(44, 44);
    const nm = top.addStack(); nm.layoutVertically();
    text(nm, titleFor(L.lv), 11, C.gold);
    text(nm, st && st.name ? st.name : "ゆうしゃ", 16, C.ink, true);
    const row = stack.addStack(); row.centerAlignContent();
    text(row, "Lv ", 10, C.dim); text(row, String(L.lv), 22, C.ink, true);
    bar(stack, L.cur/L.need, 8);
    stack.addSpacer(3);
    text(stack, (st ? st.gold || 0 : 0)+"G ・ 連続"+streak+"日", 12, C.dim);
    const rr = stack.addStack(); rr.centerAlignContent();
    text(rr, "リセット ", 12, C.dim);
    const d = rr.addDate(nextReset(now)); d.applyTimerStyle(); d.font = Font.mediumMonospacedSystemFont(12); d.textColor = C.ink;
  }
  function questLine(stack, q){
    const s = done.has(q.id) ? "done" : questState(q, now);
    const row = stack.addStack(); row.centerAlignContent(); row.spacing = 5;
    text(row, { done:"✔", open:"▶", locked:"…", expired:"×" }[s], 13, { done:C.gold, open:C[q.s] || C.ink, locked:C.dim, expired:C.danger }[s], true);
    text(row, q.t, 14, s === "open" ? C.ink : C.dim, s === "open");
  }

  function eventLine(stack, e, size){
    const row = stack.addStack(); row.centerAlignContent(); row.spacing = 6;
    const shift = SHIFT_RE.test(e.title || "") || SHIFT_RE.test(e.cal || "");
    const isDone = !!evDone[evId(e)];
    const nowIn = !e.allDay && e.start <= now.getTime() && e.end > now.getTime();
    const tm = row.addText(e.allDay ? "終日 " : hm(e.start));
    tm.font = Font.mediumMonospacedSystemFont(size - 1); tm.textColor = shift ? C.gold : (nowIn ? C.ink : C.dim); tm.lineLimit = 1;
    text(row, (isDone ? "✔ " : "") + (e.title || "予定"), size, isDone ? C.dim : C.ink, !isDone && nowIn);
    if (nowIn) text(row, "いま", 11, C.gold, true);
  }
  function eventsBlock(max, size){
    const head = w.addStack(); head.centerAlignContent();
    text(head, "今日の予定", 13, C.gold, true);
    head.addSpacer();
    const d = new Date(now);
    text(head, (d.getMonth()+1) + "/" + d.getDate() + "(" + "日月火水木金土"[d.getDay()] + ")", 12, C.dim);
    w.addSpacer(4);
    if (!upcoming.length) text(w, evsRaw ? "このあとの予定はありません" : "タップしてカレンダーを許可してください", size - 1, C.dim);
    for (const e of upcoming.slice(0, max)) { eventLine(w, e, size); w.addSpacer(2); }
    if (upcoming.length > max) text(w, "ほか " + (upcoming.length - max) + "件", 11, C.dim);
  }
  function footer(){
    const row = w.addStack(); row.centerAlignContent(); row.spacing = 6;
    const im = row.addImage(spriteImage(rankIndex(L.lv), 2)); im.imageSize = new Size(24, 24);
    text(row, "Lv" + L.lv, 15, C.ink, true);
    if (family !== "small") bar(row, L.cur/L.need, 8);
    row.addSpacer();
    text(row, "デイリー " + nDone + "/" + quests.length, 13, nDone === quests.length ? C.gold : C.dim);
  }
  function footer2(){
    const row = w.addStack(); row.centerAlignContent(); row.spacing = 4;
    text(row, (st ? st.gold || 0 : 0) + "G ・ 連続" + streak + "日" + (remsLeft.length ? " ・ リマインダー" + remsLeft.length : ""), 12, C.dim);
    row.addSpacer();
    const d = row.addDate(nextReset(now)); d.applyTimerStyle(); d.font = Font.mediumMonospacedSystemFont(12); d.textColor = C.dim; d.rightAlignText();
  }

  // 空いた行を埋めるための材料
  const tomorrow = await tomorrowEvents();
  const openQuests = quests.filter(q => !done.has(q.id) && questState(q, now) === "open");
  const customsLeft = customs.filter(c => !c.done);
  function sectionTitle(str, right){
    const h = w.addStack(); h.centerAlignContent();
    text(h, str, 12, C.dim); h.addSpacer();
    if (right) text(h, right, 12, C.dim);
  }
  function itemLine(mark, markColor, str, color){
    const row = w.addStack(); row.centerAlignContent(); row.spacing = 6;
    text(row, mark, 13, markColor, true);
    text(row, str, 14, color);
  }
  function tomorrowLines(max){
    for (const e of tomorrow.slice(0, max)) {
      const row = w.addStack(); row.centerAlignContent(); row.spacing = 6;
      const tm = row.addText(e.allDay ? "終日 " : hm(e.start));
      tm.font = Font.mediumMonospacedSystemFont(13); tm.textColor = C.dim; tm.lineLimit = 1;
      text(row, e.title || "予定", 14, C.dim);
    }
  }
  // 予定が少ないときに、空いた行へ「次にやること」を入れる
  function fillNext(slots){
    const items = [];
    for (const r of remsLeft) items.push(["!", r.overdue ? C.danger : C.gold, r.title || "リマインダー"]);
    for (const q of openQuests) items.push(["▶", C[q.s] || C.ink, q.t]);
    if (slots <= 0 || !items.length) return;
    w.addSpacer(6);
    sectionTitle("次にやること");
    for (const it of items.slice(0, slots)) itemLine(it[0], it[1], it[2], C.ink);
  }

  if (family === "small") {
    eventsBlock(2, 14);
    if (upcoming.length < 2) fillNext(2 - upcoming.length);
    w.addSpacer();
    footer();
  } else if (family === "medium") {
    eventsBlock(3, 15);
    if (upcoming.length < 2) fillNext(1);
    w.addSpacer();
    footer();
    w.addSpacer(2);
    footer2();
  } else {
    // 大:だいたい15行ぶん。予定 → ステータスとデイリー → 残りの行を埋める → ウィークリー
    const shownEv = Math.min(upcoming.length, 4);
    eventsBlock(4, 15);
    let used = 1 + Math.max(shownEv, 1) + (upcoming.length > 4 ? 1 : 0);
    if (shownEv < 2 && tomorrow.length) {
      w.addSpacer(6);
      sectionTitle("明日の予定");
      tomorrowLines(2 - shownEv);
      used += 1 + Math.min(2 - shownEv, tomorrow.length);
    }
    w.addSpacer();
    const main = w.addStack(); main.spacing = 12;
    const left = main.addStack(); left.layoutVertically(); left.size = new Size(135, 0);
    statusBlock(left);
    const right = main.addStack(); right.layoutVertically(); right.spacing = 4;
    text(right, "デイリーミッション " + nDone + "/" + quests.length, 12, C.dim);
    for (const q of quests) questLine(right, q);
    used += 7;
    let room = 15 - used - 1; // 最後の1行はウィークリー
    if (remsLeft.length && room >= 2) {
      w.addSpacer();
      const n = Math.min(remsLeft.length, room - 1, 3);
      sectionTitle("リマインダー", "のこり" + remsLeft.length + "件");
      for (const r of remsLeft.slice(0, n)) itemLine(r.overdue ? "!" : "▶", r.overdue ? C.danger : C.gold, r.title || "リマインダー", C.ink);
      room -= n + 1;
    }
    if (customsLeft.length && room >= 2) {
      w.addSpacer();
      const n = Math.min(customsLeft.length, room - 1, 3);
      sectionTitle("マイクエスト");
      for (const c of customsLeft.slice(0, n)) itemLine("▶", C.ink, c.t, C.ink);
      room -= n + 1;
    }
    w.addSpacer();
    const wk = w.addStack(); wk.centerAlignContent(); wk.spacing = 8;
    text(wk, "ウィークリー " + Math.min(week, WEEK_GOAL) + "/" + WEEK_GOAL, 12, C.dim);
    bar(wk, week/WEEK_GOAL, 9);
    wk.addSpacer();
    text(wk, "連続" + streak + "日", 12, C.dim);
  }
  if (!st) text(w, "タップして冒険をはじめる", 11, C.dim);
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
