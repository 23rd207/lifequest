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

/* ---- ゲームを開く ---- */
async function openGame(){
  let html = null;
  try {
    const req = new Request(GAME_URL + "?t=" + Date.now());
    req.timeoutInterval = 8;
    html = await req.loadString();
    if (html && html.includes("ライフクエスト")) fm.writeString(HTML_CACHE, html); else html = null;
  } catch(e) {}
  if (!html && fm.fileExists(HTML_CACHE)) html = fm.readString(HTML_CACHE);
  if (!html) {
    const a = new Alert(); a.title = "ゲームを開けませんでした"; a.message = "はじめの1回はインターネットにつないで開いてください。"; a.addAction("OK"); await a.present();
    return;
  }
  const saved = loadSave();
  const boot = "<script>window.__LQ_HOST__='scriptable';window.__LQ_STATE__=" + JSON.stringify(saved) + ";</script>";
  html = html.replace("<head>", "<head>" + boot);

  const wv = new WebView();
  await wv.loadHTML(html, GAME_URL);
  let open = true;
  const shown = wv.present(false).then(() => { open = false; });
  // ゲームがセーブするたびに受け取ってファイルに書く(1.5秒ごとに確認)
  const listen = `(function(){
    function take(){ var s=window.__lqPending; window.__lqPending=null; return s||null; }
    var now=take(); if(now){ completion(now); return; }
    var done=false;
    function h(){ if(done) return; done=true; window.removeEventListener('lq-save',h); completion(take()); }
    window.addEventListener('lq-save',h);
    setTimeout(function(){ if(done) return; done=true; window.removeEventListener('lq-save',h); completion(null); },1500);
  })()`;
  while (open) {
    try { const s = await wv.evaluateJavaScript(listen, true); if (s) writeSave(s); }
    catch(e) { break; }
  }
  await shown;
  try { const s = await wv.evaluateJavaScript("window.__lqPending||null", false); if (s) writeSave(s); } catch(e) {}
}

/* ---- ウィジェット ---- */
function buildWidget(){
  const now = new Date();
  const t = today(now);
  let st = null; try { st = JSON.parse(loadSave() || "null"); } catch(e) {}
  const L = levelInfo(st ? st.xp || 0 : 0);
  const ids = st && st.daily && st.daily.date === t && st.daily.ids && st.daily.ids.length ? st.daily.ids : dailyFor(t);
  const done = new Set(st && st.daily && st.daily.date === t ? Object.keys(st.daily.done || {}) : []);
  const quests = ids.map(id => POOL.find(p => p.id === id)).filter(Boolean);
  const nDone = quests.filter(q => done.has(q.id)).length;
  const streakAlive = st && st.streak && (st.streakDay === t || st.streakDay === ymd(new Date(gameDate(now).getTime() - 864e5)));
  const streak = streakAlive ? st.streak : 0;
  const week = st && st.week && st.week.key === weekKey(now) ? st.week.n : 0;
  const customs = st && Array.isArray(st.custom) ? st.custom.filter(c => !(c.r === "once" && c.doneOn && c.doneOn !== t))
    .map(c => ({ t:c.t, done: !!c.doneOn && periodKey(c.r, c.doneOn) === periodKey(c.r, t) })) : [];

  const family = config.widgetFamily || "medium";
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

  if (family === "small") {
    statusBlock(w);
    w.addSpacer();
    text(w, "デイリー "+nDone+"/"+quests.length, 11, nDone === quests.length ? C.gold : C.ink, true);
  } else {
    const main = w.addStack(); main.spacing = 12;
    const left = main.addStack(); left.layoutVertically(); left.size = new Size(110, 0);
    statusBlock(left);
    const right = main.addStack(); right.layoutVertically(); right.spacing = 4;
    text(right, "デイリーミッション "+nDone+"/"+quests.length, 10, C.dim);
    for (const q of quests) questLine(right, q);
    if (family === "large" || family === "extraLarge") {
      w.addSpacer(10);
      text(w, "ウィークリー "+Math.min(week, WEEK_GOAL)+"/"+WEEK_GOAL, 10, C.dim);
      bar(w, week/WEEK_GOAL, 9);
      if (customs.length) {
        w.addSpacer(8);
        text(w, "マイクエスト", 10, C.dim);
        for (const c of customs.slice(0, 5)) {
          const row = w.addStack(); row.spacing = 5;
          text(row, c.done ? "✔" : "▶", 11, c.done ? C.gold : C.ink, true);
          text(row, c.t, 12, c.done ? C.dim : C.ink);
        }
      }
    }
    w.addSpacer();
  }
  if (!st) text(w, "タップして冒険をはじめる", 9, C.dim);
  return w;
}

if (config.runsInWidget) {
  Script.setWidget(buildWidget());
} else {
  await openGame();
}
Script.complete();
