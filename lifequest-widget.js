// ライフクエスト ウィジェット(Scriptable 用)
// 使い方: ゲームの「ステータス」→「ウィジェットに反映」を押してから、このウィジェットをタップ。
// icon-color: deep-blue; icon-glyph: magic;

const DAY_START = 4;
const PREFIX = "LIFEQUEST1:";
const C = {
  sky: new Color("#0b0e2b"), win: new Color("#131a52"), ink: new Color("#f3f1ff"),
  dim: new Color("#a3a8dc"), gold: new Color("#ffd45e"), danger: new Color("#ff7b86"),
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

/* ゲームと同じ計算で、今日のデイリーミッションを出す */
const pad = n => String(n).padStart(2, "0");
function ymd(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
function gameDate(now){ return new Date(now.getTime() - DAY_START*3600e3); }
function today(now){ return ymd(gameDate(now)); }
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
function questState(q, now){
  if (q.w === "any") return "open";
  const w = WINDOWS[q.w], h = gameHour(now);
  if (h < w.from) return "locked";
  if (h >= w.to) return "expired";
  return "open";
}

/* 保存データ */
const fm = FileManager.local();
const path = fm.joinPath(fm.documentsDirectory(), "lifequest-widget.json");
function load(){ try { return fm.fileExists(path) ? JSON.parse(fm.readString(path)) : null; } catch(e){ return null; } }

if (config.runsInApp) {
  let text = "";
  try { text = Pasteboard.paste() || ""; } catch(e) {}
  if (text.startsWith(PREFIX)) {
    try {
      const data = JSON.parse(text.slice(PREFIX.length));
      fm.writeString(path, JSON.stringify(data));
    } catch(e) {}
  }
}

const data = load();
const now = new Date();
const t = today(now);
const fresh = data && data.date === t;
const ids = fresh && Array.isArray(data.ids) && data.ids.length ? data.ids : dailyFor(t);
const done = new Set(fresh ? (data.done || []) : []);
const quests = ids.map(id => POOL.find(p => p.id === id)).filter(Boolean);

const family = config.widgetFamily || "medium";
const w = new ListWidget();
w.backgroundColor = C.sky;
w.setPadding(12, 14, 12, 14);
w.refreshAfterDate = new Date(now.getTime() + 15*60e3);

function text(stack, str, size, color, bold){
  const el = stack.addText(str);
  el.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size);
  el.textColor = color; el.lineLimit = 1; el.minimumScaleFactor = 0.7;
  return el;
}
function bar(stack, ratio, width){
  const cells = 10, n = Math.round(Math.max(0, Math.min(1, ratio))*cells);
  const el = stack.addText("■".repeat(n) + "□".repeat(cells-n));
  el.font = Font.systemFont(width); el.textColor = C.gold; el.lineLimit = 1;
}
function statusBlock(stack){
  const lv = data ? data.lv : 1;
  text(stack, data ? data.title : "村人", 10, C.gold);
  text(stack, data ? data.name : "ゆうしゃ", 15, C.ink, true);
  const row = stack.addStack(); row.centerAlignContent();
  text(row, "Lv ", 10, C.dim); text(row, String(lv), 22, C.ink, true);
  if (data) bar(stack, data.cur/data.need, 8);
  stack.addSpacer(3);
  if (data) text(stack, data.gold+"G ・ 連続"+data.streak+"日", 10, C.dim);
  const rr = stack.addStack(); rr.centerAlignContent();
  text(rr, "リセット ", 10, C.dim);
  const d = rr.addDate(nextReset(now)); d.applyTimerStyle(); d.font = Font.mediumMonospacedSystemFont(10); d.textColor = C.ink;
}
function questLine(stack, q){
  const st = done.has(q.id) ? "done" : questState(q, now);
  const row = stack.addStack(); row.centerAlignContent(); row.spacing = 5;
  const mark = { done:"✔", open:"▶", locked:"…", expired:"×" }[st];
  const mc = { done:C.gold, open:C[q.s] || C.ink, locked:C.dim, expired:C.danger }[st];
  text(row, mark, 11, mc, true);
  text(row, q.t, 12, st === "open" ? C.ink : C.dim, st === "open");
}

const nDone = quests.filter(q => done.has(q.id)).length;
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
    if (data) {
      text(w, "ウィークリー "+Math.min(data.week, data.weekGoal)+"/"+data.weekGoal, 10, C.dim);
      bar(w, data.week/data.weekGoal, 9);
      w.addSpacer(8);
      const my = (data.customs || []);
      if (my.length) {
        text(w, "マイクエスト", 10, C.dim);
        for (const c of my.slice(0, 5)) {
          const row = w.addStack(); row.spacing = 5;
          text(row, c.done ? "✔" : "▶", 11, c.done ? C.gold : C.ink, true);
          text(row, c.t, 12, c.done ? C.dim : C.ink);
        }
      }
    }
  }
  w.addSpacer();
}
if (!data) text(w, "ゲームで「ウィジェットに反映」→ここをタップ", 9, C.dim);
else if (!fresh) text(w, "まだ今日の反映がありません", 9, C.dim);
else { const at = new Date(data.at); text(w, "反映 "+pad(at.getHours())+":"+pad(at.getMinutes()), 9, C.dim); }

if (config.runsInWidget) Script.setWidget(w);
else await w.presentMedium();
Script.complete();
