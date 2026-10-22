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
  {id:"n5",t:"日付が変わる前にふとんに入る",s:"body",d:3,w:"night",to:24}
];
const TITLES = [[1, "村人"], [3, "旅立ちの若者"], [6, "見習い冒険者"], [10, "冒険者"], [15, "熟練の旅人"], [20, "騎士"], [30, "勇者"], [40, "英雄"], [50, "伝説の勇者"], [65, "星を継ぐ者"], [80, "人生の賢者"], [100, "人生を極めし者"]];
// 階級ごとのドット絵(16x16)。1文字 = 1ドット、"." は透明
const SPRITE_PAL = {"K": "#1a1030", "S": "#ffcf9e", "s": "#e0a070", "H": "#6b3f1f", "h": "#4a2a14", "B": "#5a3a28", "b": "#3e271a", "W": "#e6e9f8", "w": "#9aa0c0", "T": "#8a5a2c", "G": "#ffd45e", "g": "#c99a2e", "A": "#fff6c8", "M": "#bb93ff", "m": "#7d5ad0", "R": "#e04a5a", "r": "#a8303e", "N": "#2a2f6e", "n": "#1b1f4a", "Y": "#ffffff", "O": "#6fbcff", "o": "#3c7fcf", "L": "#7fbf6a", "l": "#4f8a44", "U": "#c9a77a", "u": "#9a7a52", "I": "#b8bfd8", "i": "#7f86a8", "V": "#f3f1ff", "v": "#c8c4e8", "D": "#2b2b3a", "d": "#15151f", "Z": "#ff9ec4", "z": "#e070a0", "F": "#ffffff", "f": "#d6d6e6", "Q": "#5ad1c8", "q": "#2f9a92", "X": "#7a1d2a", "x": "#4a0f18", "J": "#ff8a3c", "j": "#c45f1c"};
// きせかえ(ショップでGで買える)。[id, 名前, 値段, ドット絵]
const COSTUMES = [
  ["pajama", "パジャマ", 100, [".........KK.....", ".....KKKKZZK....", "....KKKZZZZKZ...", "...KKZZZZZZKK...", "...KzzzzzzzzK...", "...KSSKSSKSSK...", "...KSSKSSKSSK...", "...KsSSSSSSsK...", "....KSSssSSK....", ".....KKKKKK.....", "....KZZZZZZK....", "KKKKSZZZZZZSK...", "KFFFKKzzzzKSK...", "KFFFKZZKKZZK....", "KKKKKBBK.KBBK...", "....KKK...KKK..."]],
  ["student", "学生服", 150, ["................", ".....KKKKKK.....", "....KHHHHHHK....", "...KHHHHHHHHK...", "...KHSSSSSSHK...", "...KSSKSSKSSK...", "...KSSKSSKSSK...", "...KsSSSSSSsK...", "....KSSssSSK....", ".....KKKKKK.....", "....KDGDDGDK....", ".KKKKDDGDDDSK...", "KKOOKddddKSKK...", "KKooKDDKKDDK....", ".KKKKBBK.KBBK...", "....KKK...KKK..."]],
  ["chef", "コック", 200, ["....KKKKKKKK....", "...KFFFFFFFFK...", "...KFFFFFFFFK...", "...KfFFFFFFfK...", "...KKKKKKKKKK...", "...KSSKSSKSKKK..", "...KSSKSSKSKWK..", "...KsSSSSSSsKW..", "....KSSssSSKKWK.", ".....KKKKKK.KwK.", "....KKFFFFKKwK..", "...KSKFFFFKSw...", "...KSKFFFFKSK...", "....KFFKKFFK....", "....KBBK.KBBK...", "....KKK...KKK..."]],
  ["cat", "ねこみみ", 250, ["..KK........KK..", "..KZKKKKKKKKZK..", "..KHHHKKKKHHHK..", "...KHHHHHHHHK...", "...KHSSSSSSHK...", "...KSSKSSKSSK...", "...KSSKSSKSSK...", "...KsSSSSSSsK...", "....KSSssSSK....", ".....KKKKKK.....", "....KHHHHHHK....", "...KSHHHHHHSKKHK", "...KSKhhhhKSKKHK", "....KHHKKHHKKHK.", "....KBBK.KBBKK..", "....KKK...KKK..."]],
  ["ninja", "忍者", 400, ["................", ".....KKKKKK.....", "...KDDDDDDDDK...", "...KDDDDDDDDK...", "...KRRRRRRRRKRR.", "...KSSKSSKSSK...", "...KSSKSSKSSK...", "...KDDDDDDDDKK..", "....KDDDDDDKKWK.", ".....KKKKKK.KWK.", "....KDDDDDDKDDDK", "...KSDDDDDDSKDK.", "...KSKddddKSK...", "....KDDKKDDK....", "....KBBK.KBBK...", "....KKK...KKK..."]],
  ["pirate", "海賊", 500, ["...KKKKKKKKKK...", "..KDDDDYDDDDDK..", ".KDDDDDDDDDDDDK.", "...KRRRRRRRRK...", "...KHSSSSSSHK...", "...KSSKSKKKSK...", "...KSSKSKKKSK...", "...KsSSSSSSsK...", "....KSSssSSK....", ".....KKKKKK.KWK.", "....KRRRRRRKWK..", "...KSRRRRRRSKWK.", "...KSKrrrrKSKKK.", "....KRRKKRRK....", "....KBBK.KBBK...", "....KKK...KKK..."]],
  ["idol", "アイドル", 600, ["................", "....KKKKKKKK....", "...KZZZZZZZZK...", "..KZZZZZZZZZZK..", "..KZZSSSSSSZZK..", "...KSSKSSKSSK...", "...KSSKSSKSSK...", "..KZsSSSSSSsKDK.", "..KZKSSssSSKKDK.", "...KKKKKKKKKKK..", "....KZZZZZZKKTK.", "...KSZZZZZZSKTK.", "...KSKzzzzKSK...", "...KZZZZZZZZK...", "....KBBK.KBBK...", "....KKK...KKK..."]],
  ["santa", "サンタ", 800, ["..........KKF...", ".....KKKKKRRKF..", "....KRRRRRRRK...", "...KFFFFFFFFK...", "...KHSSSSSSHK...", "...KSSKSSKSSK...", "...KSSKSSKSSK...", "...KsSSSSSSsK...", "....KFFFFFFK....", ".KKKKFFFFFFK....", "KJJJKRRRRRRK....", "KJJJJKRRRRRSK...", "KJJJJKrrrrKSK...", ".KKKKRRKKRRK....", "....KBBK.KBBK...", "....KKK...KKK..."]],
  ["astro", "宇宙飛行士", 1200, ["....KKKKKKKK....", "...KFFFFFFFFK...", "..KFKKKKKKKKFK..", "..KFKQQQQQQKFK..", "..KFKQSSSSQKFK..", "..KFKSSKSKSKFK..", "..KFKSSKSKSKFK..", "..KFKQSSSSQKFK..", "..KFFKKKKKKFFK..", "...KKKKKKKKKK...", "....KFFOOFFK....", "...KFFFFFFFFK...", "...KFKffffKFK...", "....KFFKKFFK....", "....KFFK.KFFK...", "....KKK...KKK..."]],
  ["dragon", "ドラゴン着ぐるみ", 1500, ["...K.K....K.K...", "..KLKLKKKKLKLK..", "..KLLLLLLLLLLK..", ".KLLLLLLLLLLLLK.", ".KLlSSSSSSSSlLK.", ".KLSSKSSSSKSSLK.", ".KLSSKSSSSKSSLK.", ".KLlsSSSSSSslLK.", "..KLLLLLLLLLLK..", ".....KKKKKK.....", "....KLLLLLLK....", "...KSLLLLLLSKLLK", "...KSKllllKSKKLK", "....KLLKKLLK..KK", "....KBBK.KBBK...", "....KKK...KKK..."]],
  ["maou", "魔王", 3000, ["..KK........KK..", "A.KXKKKKKKKKXK.A", "...KXHHHHHHXK...", "...KHHHHHHHHKXK.", "A..KHSSSSSSHKXK.", "...KSSKSSKSSKXK.", "...KSSRSSRSSKXK.", "...KsSSSSSSsKXKA", "....KSSssSSKKXK.", "...K.KKKKKKKKXK.", "..KDKXXXXXKKDDDK", "..KDSXXXXXDKKDK.", "A.KdSKxxxxdKK...", "..KdKXXKKKdK....", "...KKBBK.KBKK..A", "....KKK...KKK..."]]
];
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
// 何日も続く予定の終わり("〜10/20(火)" / "〜翌6:00")。1日で終わるなら ""
function untilLabel(e){
  const s0 = new Date(e.start); const last = new Date((e.end || e.start) - 1);
  const a = new Date(s0.getFullYear(), s0.getMonth(), s0.getDate()), b = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const days = Math.round((b - a) / 864e5);
  if (days < 1) return "";
  if (!e.allDay && days === 1 && last.getHours() < 12) return "〜翌" + hm(e.end);
  return "〜" + (b.getMonth()+1) + "/" + b.getDate() + "(" + "日月火水木金土"[b.getDay()] + ")";
}
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
function spriteRows(key){
  if (typeof key === "number") return SPRITES[key];
  if (key.startsWith("c:")) { const c = COSTUMES.find(x => x[0] === key.slice(2)); return c ? c[3] : SPRITES[0]; }
  return SPRITES[Number(key.slice(1))] || SPRITES[0];
}
// ゲームで着ている見た目(きせかえ・昔の階級の姿・いまの階級)
function lookKey(st, lv){
  const ri = rankIndex(lv), wd = st && st.wardrobe ? st.wardrobe : {}, w = wd.wear || "";
  if (w.startsWith("c:") && wd.owned && wd.owned[w.slice(2)]) return w;
  if (/^r\d+$/.test(w) && Number(w.slice(1)) <= ri) return w;
  return "r" + ri;
}
function spriteImage(i, scale){
  const ctx = new DrawContext();
  ctx.size = new Size(16*scale, 16*scale); ctx.opaque = false; ctx.respectScreenScale = true;
  spriteRows(i).forEach((row, y) => [...row].forEach((ch, x) => {
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
  const w = WINDOWS[q.w], h = gameHour(now), to = q.to || w.to;
  if (h < w.from) return "locked";
  if (h >= to) return "expired";
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
// ゲームの1日(朝4時〜翌朝4時)の予定。offset 0 = 今日、1 = 明日
// 終日の予定は「その日付」のものだけにする(翌日の終日予定が混ざらないように)
async function eventsForDay(offset){
  const now = new Date();
  const gd = gameDate(now);
  const day = new Date(gd.getFullYear(), gd.getMonth(), gd.getDate() + offset);
  const ds = ymd(day);
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), DAY_START);
  const end = new Date(start.getTime() + 24*3600e3);
  const evs = await CalendarEvent.between(new Date(day.getFullYear(), day.getMonth(), day.getDate()), end, []);
  return dedupeEvents(evs).filter(e => !SKIP_CAL.test(e.calendar ? e.calendar.title : ""))
    .filter(e => e.isAllDay
      ? ymd(e.startDate) <= ds && e.endDate.getTime() > day.getTime()
      : e.endDate.getTime() > start.getTime() && e.startDate.getTime() < end.getTime())
    .sort((a,b) => (a.isAllDay ? 0 : 1) - (b.isAllDay ? 0 : 1) || a.startDate - b.startDate);
}
async function todayEvents(){
  try { return (await eventsForDay(0)).slice(0, 12).map(mapEvent); } catch(e) { return null; }
}
// 近々の予定:明日から days 日先まで
async function soonEvents(days){
  try {
    let out = [];
    for (let i = 1; i <= days; i++) out = out.concat((await eventsForDay(i)).filter(e => !out.some(x => x.identifier === e.identifier && x.startDate.getTime() === e.startDate.getTime())));
    return out.map(mapEvent);
  } catch(e) { return []; }
}
async function tomorrowEvents(){
  try { return (await eventsForDay(1)).map(mapEvent); } catch(e) { return []; }
}
// 編集・削除のために、読み込んだ予定を覚えておく(くり返し予定は日時で区別)
const eventMap = new Map();
function mapEvent(e){
  const k = e.identifier + "|" + e.startDate.getTime();
  eventMap.set(k, e);
  return { id: e.identifier, k, title: e.title, start: e.startDate.getTime(), end: e.endDate.getTime(),
    allDay: e.isAllDay, cal: e.calendar ? e.calendar.title : "",
    editable: e.calendar ? e.calendar.allowsContentModifications !== false && !e.calendar.isSubscribed : true };
}
// こよみ画面用:先月の1日〜再来月の1日まで
// 同じ予定が複数のカレンダーに入っている(祝日カレンダーが2つある等)ときは1つにまとめる
function dedupeEvents(evs){
  const seen = new Set();
  return evs.filter(e => {
    // 祝日カレンダー同士は、名前の書き方が違っても(「文化の日」と「Culture Day」など)同じ日なら1つに
    const hol = /祝日|休日|Holiday/i.test(e.calendar ? e.calendar.title : "");
    const name = (e.title || "").replace(/[\s　]+/g, "").replace(/[（(].*?[)）]/g, "");
    const k = hol ? "HOL|" + ymd(e.startDate) : name + "|" + (e.isAllDay ? "D" + ymd(e.startDate) : e.startDate.getTime() + "-" + e.endDate.getTime());
    if (seen.has(k)) return false; seen.add(k); return true;
  });
}
// こよみ用:最初は先月〜半年先まで。それ以外の月は、こよみで開いたときに読み込む
const MONTH_BEFORE = 1, MONTH_AFTER = 6;
function monthRange(){
  const now = new Date();
  return [new Date(now.getFullYear(), now.getMonth() - MONTH_BEFORE, 1), new Date(now.getFullYear(), now.getMonth() + MONTH_AFTER + 1, 1)];
}
async function monthEvents(from, to){
  try {
    const [s0, e0] = from ? [from, to] : monthRange();
    const evs = await CalendarEvent.between(s0, e0, []);
    return dedupeEvents(evs.filter(e => !/誕生日|Birthday/i.test(e.calendar ? e.calendar.title : ""))).slice(0, 3000).map(mapEvent);
  } catch(e) { return null; }
}

/* ---- リマインダー(期限が2週間以内・期限切れ・今日完了したもの) ---- */
const REM_DAYS = 14;
const remMap = new Map();
let remAll = null;
let remInfo = null; // 読み込みの内訳(ゲームに表示して原因を探す用)
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
    // 「ほしいもの・したいこと」はショップで扱うので、クエストには出さない
    const notWish = r => !/ほしいもの|欲しいもの|したいこと/.test(r.calendar ? r.calendar.title : "") && !PAY_RE.test(r.calendar ? r.calendar.title : "");
    const allOpen = (await Reminder.allIncomplete()).filter(notWish);
    const open = allOpen.filter(dueToday);
    remInfo = { all: allOpen.length, dated: allOpen.filter(r => !!r.dueDate).length, inRange: open.length, ver: 3 };
    let doneToday = [];
    try { doneToday = (await Reminder.completedToday()).filter(notWish).filter(r => !r.dueDate || dueToday(r)); } catch(e) {}
    const byDue = (a, b) => (a.dueDate ? a.dueDate.getTime() : 0) - (b.dueDate ? b.dueDate.getTime() : 0);
    const all = open.sort(byDue).slice(0, 40).concat(doneToday);
    remMap.clear();
    const toObj = r => {
      remMap.set("r" + hash(String(r.identifier)).toString(36), r);
      return { id: r.identifier, title: r.title, due: r.dueDate ? r.dueDate.getTime() : null,
        hasTime: !!r.dueDateIncludesTime, overdue: !r.isCompleted && !!r.dueDate && overdue(r),
        list: r.calendar ? r.calendar.title : "", priority: r.priority || 0, completed: !!r.isCompleted };
    };
    // 「すべて表示」用:期限なし・2週間より先も含めた未完了ぜんぶ
    remAll = allOpen.slice().sort((a, b) => (a.dueDate ? a.dueDate.getTime() : 9e15) - (b.dueDate ? b.dueDate.getTime() : 9e15)).slice(0, 300).map(toObj);
    return all.map(toObj);
  } catch(e) { remInfo = { error: String(e), ver: 3 }; return null; }
}

/* ---- 支払い・クレカのリスト(ToDoではないので別枠) ---- */
const PAY_RE = /クレカ|クレジット|カード|支払|引き?落/;
const YEN_RE = /([0-9０-９][0-9０-９,，]*)\s*円|[¥￥]\s*([0-9０-９][0-9０-９,，]*)/;
const payMap = new Map();
let payCals = [];
async function loadPays(){
  try {
    const cals = (await Calendar.forReminders()).filter(c => PAY_RE.test(c.title));
    payCals = cals;
    if (!cals.length) return [];
    const items = await Reminder.allIncomplete(cals);
    payMap.clear();
    return items.slice(0, 60).map(r => {
      payMap.set(r.identifier, r);
      const m = YEN_RE.exec(r.title || "") || YEN_RE.exec(r.notes || "");
      const amount = m ? Number(toHalf(m[1] || m[2]).replace(/[,，]/g, "")) : 0;
      return { id: r.identifier, title: r.title, due: r.dueDate ? r.dueDate.getTime() : null,
        hasTime: !!r.dueDateIncludesTime, list: r.calendar ? r.calendar.title : "", amount };
    });
  } catch(e) { return null; }
}

/* ---- ごほうびショップ ⇄ リマインダー「ほしいもの・したいこと」 ---- */
const WISH_RE = /ほしいもの|欲しいもの|したいこと/;
const WISH_NAME = "ほしいもの・したいこと";
const PRICE_RE = /([0-9０-９]{1,6})\s*[GＧg](?![A-Za-z])/;
const wishMap = new Map();
let wishCal = null;
function toHalf(str){ return String(str).replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)); }
async function loadWishes(){
  try {
    const cals = await Calendar.forReminders();
    wishCal = cals.find(c => WISH_RE.test(c.title)) || null;
    if (!wishCal) return null;
    const items = await Reminder.allIncomplete([wishCal]);
    wishMap.clear();
    return items.map(r => {
      wishMap.set("w" + hash(String(r.identifier)).toString(36), r);
      const m = PRICE_RE.exec(r.notes || "") || PRICE_RE.exec(r.title || "");
      const title = (r.title || "").replace(PRICE_RE, "").trim();
      return { id: r.identifier, title: title || r.title, price: m ? Number(toHalf(m[1])) : 100, priced: !!m };
    });
  } catch(e) { return null; }
}
function setPriceInNotes(notes, price){
  const n = notes || "";
  return PRICE_RE.test(n) ? n.replace(PRICE_RE, price + "G") : (n ? n + "\n" : "") + price + "G";
}

/* ---- 天気(現在地 + Open-Meteo。キーなしで使える無料の天気API) ---- */
const WX_FILE = fm.joinPath(dir, "lifequest-weather.json");
async function getWeather(maxAgeMin){
  let cache = null; try { cache = JSON.parse(fm.readString(WX_FILE)); } catch(e) {}
  if (cache && cache.data && Date.now() - cache.at < maxAgeMin * 60e3) return cache.data;
  try {
    let loc = cache && cache.loc && Date.now() - (cache.loc.at || 0) < 6 * 3600e3 ? cache.loc : null;
    if (!loc) {
      try {
        Location.setAccuracyToThreeKilometers();
        const l = await Location.current();
        loc = { lat: l.latitude, lon: l.longitude, at: Date.now(), place: "" };
        try { const g = await Location.reverseGeocode(l.latitude, l.longitude, "ja_JP"); const a = g && g[0]; if (a) loc.place = a.locality || a.subAdministrativeArea || a.administrativeArea || ""; } catch(e) {}
      } catch(e) { loc = cache && cache.loc ? cache.loc : null; }
    }
    if (!loc) return cache ? cache.data : null;
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + loc.lat.toFixed(3) + "&longitude=" + loc.lon.toFixed(3)
      + "&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3";
    const r = new Request(url); r.timeoutInterval = 6;
    const j = await r.loadJSON();
    const data = { place: loc.place || "", at: Date.now(),
      now: { t: j.current.temperature_2m, code: j.current.weather_code },
      days: j.daily.time.map((d, i) => ({ date: d, code: j.daily.weather_code[i], max: j.daily.temperature_2m_max[i],
        min: j.daily.temperature_2m_min[i], pop: j.daily.precipitation_probability_max[i] })) };
    fm.writeString(WX_FILE, JSON.stringify({ at: Date.now(), data, loc }));
    return data;
  } catch(e) { return cache ? cache.data : null; }
}
function wxIcon(code){
  if (code === 0) return "☀️"; if (code <= 2) return "🌤"; if (code === 3) return "☁️"; if (code <= 48) return "🌫";
  if (code <= 57) return "🌦"; if (code <= 67) return "🌧"; if (code <= 77) return "❄️"; if (code <= 82) return "🌦"; if (code <= 86) return "🌨"; return "⛈";
}

/* ---- ヘルスケア(ショートカットの「スクリプトを実行」から歩数・睡眠を受け取る) ---- */
const HEALTH_FILE = fm.joinPath(dir, "lifequest-health.json");
function loadHealth(){ try { return JSON.parse(fm.readString(HEALTH_FILE)) || {}; } catch(e) { return {}; } }
function parseHealthInput(p){
  const num = v => { const n = Number(String(v).replace(/[,，\s]/g, "").replace(/[０-９．]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))); return isFinite(n) ? n : null; };
  let steps = null, sleep = null;
  if (p && typeof p === "object" && !Array.isArray(p)) {
    for (const [k, v] of Object.entries(p)) {
      if (/歩|step/i.test(k)) steps = num(v);
      else if (/睡眠|寝|sleep/i.test(k)) sleep = num(v);
    }
  } else if (p != null) {
    const t = String(p);
    const ms = /(?:歩数|steps?)\D{0,4}([0-9０-９][0-9０-９,，.．]*)/i.exec(t) || /([0-9０-９][0-9０-９,，]*)\s*歩/.exec(t);
    const mh = /(?:睡眠|sleep)\D{0,4}([0-9０-９][0-9０-９.．]*)/i.exec(t);
    if (ms) steps = num(ms[1]); if (mh) sleep = num(mh[1]);
    if (!ms && !mh && num(t) != null) steps = num(t);
  }
  // 睡眠は「時間」にそろえる(分や秒で来たときも直す)
  if (sleep != null) { if (sleep > 1440) sleep = sleep / 3600; else if (sleep > 24) sleep = sleep / 60; sleep = Math.round(sleep * 10) / 10; }
  if (steps != null) steps = Math.round(steps);
  return { steps, sleep };
}
async function receiveHealth(param){
  const h = loadHealth();
  const ds = ymd(gameDate(new Date()));
  const { steps, sleep } = parseHealthInput(param);
  const rec = h[ds] || {};
  if (steps != null) rec.steps = steps;
  if (sleep != null) rec.sleep = sleep;
  rec.at = Date.now();
  h[ds] = rec;
  for (const k of Object.keys(h)) if (k < ymd(new Date(Date.now() - 60 * 864e5))) delete h[k];
  fm.writeString(HEALTH_FILE, JSON.stringify(h));
  const msg = "ライフクエストに記録:" + (rec.steps != null ? "歩数 " + rec.steps.toLocaleString("ja-JP") + "歩" : "") + (rec.sleep != null ? " 睡眠 " + rec.sleep + "時間" : "");
  Script.setShortcutOutput(msg);
  return msg;
}

/* ---- Obsidian(Scriptable の設定 →「File Bookmarks」に「Obsidian」という名前で保管庫フォルダを登録) ---- */
const OBS_BM = "Obsidian";
const OBS_TAG = /#(quest|クエスト)(?![\w぀-ヿ一-龯])/i;
const NOTE_TAG = /#(lifequest|ライフクエスト)(?![\w぀-ヿ一-龯])/i;
const obsMap = new Map();
let obsRootPath = null;
function obsFm(){ try { return FileManager.iCloud(); } catch(e) { return FileManager.local(); } }
function obsRoot(){
  try { const l = FileManager.local(); if (l.bookmarkExists(OBS_BM)) return l.bookmarkedPath(OBS_BM); } catch(e) {}
  return null;
}
function obsRead(path, allowDownload){
  const f = obsFm();
  try {
    if (!f.fileExists(path)) return null;
    if (f.isFileStoredIniCloud(path) && !f.isFileDownloaded(path)) return allowDownload ? "__DL__" : null;
    return f.readString(path);
  } catch(e) { try { return FileManager.local().readString(path); } catch(e2) { return null; } }
}
async function obsReadDl(path){
  let t = obsRead(path, true);
  if (t === "__DL__") { try { await obsFm().downloadFileFromiCloud(path); } catch(e) {} t = obsRead(path, false); }
  return t;
}
function obsWrite(path, text){ obsFm().writeString(path, text); }
function obsWalk(root){
  const f = obsFm(), out = [], stack = [""], t0 = Date.now();
  while (stack.length && out.length < 1500 && Date.now() - t0 < 3000) {
    const rel = stack.pop();
    let names = [];
    try { names = f.listContents(rel ? f.joinPath(root, rel) : root); } catch(e) { continue; }
    for (const n of names) {
      if (n.startsWith(".")) continue;
      const r = rel ? rel + "/" + n : n;
      let dir = false; try { dir = f.isDirectory(f.joinPath(root, r)); } catch(e) {}
      if (dir) stack.push(r); else if (/\.md$/i.test(n)) out.push(r);
    }
  }
  return out;
}
// Obsidian のデイリーノート設定(.obsidian/daily-notes.json)を読み、日付の書式どおりのパスを作る
function momentFmt(d, fmt){
  const W = ["日","月","火","水","木","金","土"], WE = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return String(fmt).replace(/\[([^\]]*)\]|YYYY|YY|MM|M|DD|D|dddd|ddd/g, (m, lit) => {
    if (lit !== undefined) return lit;
    return { YYYY: d.getFullYear(), YY: String(d.getFullYear()).slice(2), MM: pad(d.getMonth()+1), M: d.getMonth()+1,
      DD: pad(d.getDate()), D: d.getDate(), dddd: WE[d.getDay()], ddd: W[d.getDay()] }[m];
  });
}
async function dailyNotePath(root, date){
  let folder = "", format = "YYYY-MM-DD";
  try {
    const cfg = await obsReadDl(obsFm().joinPath(root, ".obsidian/daily-notes.json"));
    if (cfg) { const j = JSON.parse(cfg); if (j.folder) folder = String(j.folder).replace(/^\/+|\/+$/g, ""); if (j.format) format = j.format; }
  } catch(e) {}
  const rel = (folder ? folder + "/" : "") + momentFmt(date, format) + ".md";
  return { rel, path: obsFm().joinPath(root, rel) };
}
async function loadObsidian(){
  const root = obsRoot();
  obsRootPath = root;
  if (!root) return { ok: false, reason: "no-bookmark" };
  try {
    const now = new Date(), gd = gameDate(now), t = ymd(gd);
    const lim = ymd(new Date(gd.getFullYear(), gd.getMonth(), gd.getDate() + REM_DAYS - 1));
    const daily = await dailyNotePath(root, new Date(gd.getFullYear(), gd.getMonth(), gd.getDate()));
    const files = obsWalk(root);
    const tasks = [], notes = [];
    obsMap.clear();
    let skipped = 0;
    const t0 = Date.now();
    for (const rel of files) {
      if (Date.now() - t0 > 4000 && rel !== daily.rel) { skipped++; continue; }
      const text = rel === daily.rel ? await obsReadDl(daily.path) : obsRead(obsFm().joinPath(root, rel), false);
      if (text == null) { skipped++; continue; }
      const name = rel.replace(/^.*\//, "").replace(/\.md$/i, "");
      if (NOTE_TAG.test(text) && notes.length < 30) notes.push({ id: "n" + hash(rel).toString(36), title: name, rel, body: text.slice(0, 6000) });
      if (!/\[[ xX]\]/.test(text)) continue;
      const lines = text.split("\n");
      for (const raw of lines) {
        const m = /^(\s*[-*+]\s+)\[( |x|X)\]\s+(.*)$/.exec(raw);
        if (!m) continue;
        const body = m[3];
        const due = (/📅\s*(\d{4}-\d{2}-\d{2})/.exec(body) || [])[1] || null;
        const doneOn = (/✅\s*(\d{4}-\d{2}-\d{2})/.exec(body) || [])[1] || null;
        const checked = m[2] !== " ";
        const relevant = rel === daily.rel || OBS_TAG.test(body) || (due && due <= lim);
        if (!relevant) continue;
        if (checked && !(doneOn === t || rel === daily.rel)) continue;
        const id = "o" + hash(rel + "|" + raw.replace(/\[[ xX]\]/, "[ ]").replace(/\s*✅\s*\d{4}-\d{2}-\d{2}/, "")).toString(36);
        obsMap.set(id, { rel, raw });
        const title = body.replace(/(?:📅|✅|⏳|🛫)\s*\d{4}-\d{2}-\d{2}/g, "").replace(OBS_TAG, "").replace(/\s+/g, " ").trim();
        tasks.push({ id, text: title || body, due, file: name, folder: rel.includes("/") ? rel.replace(/\/[^/]*$/, "") : "", completed: checked, inDaily: rel === daily.rel });
        if (tasks.length >= 200) break;
      }
    }
    let diaryText = "";
    try {
      const dt = await obsReadDl(daily.path);
      const m = dt && /<!-- lifequest:diary:start -->\n?(?:## [^\n]*\n)?([\s\S]*?)\n?<!-- lifequest:diary:end -->/.exec(dt);
      if (m) diaryText = m[1].trim();
    } catch(e) {}
    return { ok: true, vault: root.replace(/^.*\//, ""), tasks, notes, daily: daily.rel, files: files.length, skipped, diaryText, diaryDs: t };
  } catch(e) { return { ok: false, reason: "error", error: String(e) }; }
}
// タスクのチェックを付け外しする(ファイルの該当行だけ書き換える)
async function obsSetTask(id, done){
  const it = obsMap.get(id); if (!it || !obsRootPath) return;
  const path = obsFm().joinPath(obsRootPath, it.rel);
  const text = await obsReadDl(path); if (text == null) return;
  const lines = text.split("\n");
  const i = lines.indexOf(it.raw); if (i < 0) return;
  let line = lines[i];
  if (done) {
    line = line.replace(/\[ \]/, "[x]");
    if (/📅/.test(line) && !/✅/.test(line)) line += " ✅ " + ymd(gameDate(new Date()));
  } else {
    line = line.replace(/\[[xX]\]/, "[ ]").replace(/\s*✅\s*\d{4}-\d{2}-\d{2}/, "");
  }
  lines[i] = line; it.raw = line;
  obsWrite(path, lines.join("\n"));
}
// 冒険日記:今日のデイリーノートに、その日の記録を書き込む(<!-- lifequest --> で囲んだ部分だけを毎回入れ替え)
// ゲームで書いた日記を、その日のデイリーノートの「📖 日記」欄に書き込む(前回書いたあとに変わった日だけ)
const DIARY_SENT = FileManager.local().joinPath(FileManager.local().documentsDirectory(), "lifequest-diary-sent.json");
async function writeDiaryEntries(root, st){
  let sent = {}; try { sent = JSON.parse(FileManager.local().readString(DIARY_SENT)) || {}; } catch(e) {}
  const re = /<!-- lifequest:diary:start -->[\s\S]*?<!-- lifequest:diary:end -->/;
  for (const [ds, d] of Object.entries(st.diary || {})) {
    if (!d || !d.at || (sent[ds] || 0) >= d.at) continue;
    const [y, m, dd] = ds.split("-").map(Number);
    const dn = await dailyNotePath(root, new Date(y, m - 1, dd));
    try { const dir = dn.path.replace(/\/[^/]*$/, ""); if (!obsFm().fileExists(dir)) obsFm().createDirectory(dir, true); } catch(e) {}
    let text = (await obsReadDl(dn.path)) || "";
    const block = "<!-- lifequest:diary:start -->\n## 📖 日記\n" + String(d.text || "").trim() + "\n<!-- lifequest:diary:end -->";
    text = re.test(text) ? text.replace(re, block) : (text ? text.replace(/\s*$/, "") + "\n\n" : "") + block + "\n";
    obsWrite(dn.path, text);
    sent[ds] = d.at;
  }
  try { FileManager.local().writeString(DIARY_SENT, JSON.stringify(sent)); } catch(e) {}
}
async function writeDiary(saveStr){
  const root = obsRoot(); if (!root || !saveStr) return;
  let st; try { st = JSON.parse(saveStr); } catch(e) { return; }
  if (st.obsDiary === false) return;
  try { await writeDiaryEntries(root, st); } catch(e) {}
  const now = new Date(), gd = gameDate(now);
  const day0 = new Date(gd.getFullYear(), gd.getMonth(), gd.getDate(), DAY_START).getTime(), day1 = day0 + 864e5;
  const logs = (st.log || []).filter(l => l.ts >= day0 && l.ts < day1);
  if (!logs.length) return;
  const cnt = new Map(); let xp = 0, g = 0; const bought = [];
  for (const l of logs.slice().reverse()) {
    xp += l.xp || 0; g += l.g || 0;
    if (/^(ごほうび|きせかえ)購入:/.test(l.t)) { bought.push(l.t.replace(/^.*?:/, "")); continue; }
    const undo = /^取り消し:/.test(l.t), key = l.t.replace(/^取り消し:/, "");
    cnt.set(key, (cnt.get(key) || 0) + (undo ? -1 : 1));
  }
  const doneList = [...cnt.entries()].filter(([k, n]) => n > 0).map(([k]) => k);
  const L = levelInfo(st.xp || 0);
  const block = ["<!-- lifequest:start -->", "## ⚔️ ライフクエスト",
    "- " + titleFor(L.lv) + " Lv" + L.lv + " ・ 連続" + (st.streak || 0) + "日 ・ 所持金 " + (st.gold || 0) + "G",
    "- 今日の達成 " + doneList.length + "件(+" + Math.max(0, xp) + "EXP / " + (g >= 0 ? "+" : "") + g + "G)"]
    .concat(doneList.map(t => "  - " + t))
    .concat(bought.length ? ["- 買ったもの:" + bought.join("、")] : [])
    .concat(["<!-- lifequest:end -->"]).join("\n");
  const dn = await dailyNotePath(root, new Date(gd.getFullYear(), gd.getMonth(), gd.getDate()));
  try { const dir = dn.path.replace(/\/[^/]*$/, ""); if (!obsFm().fileExists(dir)) obsFm().createDirectory(dir, true); } catch(e) {}
  let text = (await obsReadDl(dn.path)) || "";
  const re = /<!-- lifequest:start -->[\s\S]*?<!-- lifequest:end -->/;
  text = re.test(text) ? text.replace(re, block) : (text ? text.replace(/\s*$/, "") + "\n\n" : "") + block + "\n";
  obsWrite(dn.path, text);
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
  const [events, month, rems, wishes] = [await todayEvents(), await monthEvents(), await loadReminders(), await loadWishes()];
  const pays = await loadPays();
  // 予定を書き込めるカレンダー(標準のカレンダーを先頭に)
  let evCals = [];
  try {
    const def = await Calendar.defaultForEvents();
    evCals = [def].concat((await Calendar.forEvents()).filter(c => c.identifier !== def.identifier
      && c.allowsContentModifications !== false && !c.isSubscribed));
  } catch(e) {}
  const findEvCal = async title => evCals.find(c => c.title === title) || evCals[0] || await Calendar.defaultForEvents();
  let remCals = [];
  try {
    const def = await Calendar.defaultForReminders();
    remCals = [def].concat((await Calendar.forReminders()).filter(c => c.identifier !== def.identifier));
  } catch(e) {}
  const js = v => JSON.stringify(v).replace(/</g, "\\u003c");
  const weather = await getWeather(30);
  const healthToday = loadHealth()[ymd(gameDate(new Date()))] || null;
  const boot = "<script>window.__LQ_HOST__='scriptable';window.__LQ_WEATHER__=" + js(weather) + ";window.__LQ_HEALTH__=" + js(healthToday)
    + ";window.__LQ_STATE__=" + js(saved)
    + ";window.__LQ_EVENTS__=" + js(events) + ";window.__LQ_MONTH__=" + js(month)
    + ";window.__LQ_MONTHRANGE__=" + js(monthRange().map(d => d.getTime()))
    + ";window.__LQ_REMS__=" + js(rems) + ";window.__LQ_REMS_ALL__=" + js(remAll) + ";window.__LQ_REMLISTS__=" + js(remCals.map(c => c.title)) + ";window.__LQ_REMINFO__=" + js(remInfo) + ";window.__LQ_WISHES__=" + js(wishes)
    + ";window.__LQ_WISHLIST__=" + js(wishCal ? wishCal.title : "") + ";window.__LQ_EVCALS__=" + js(evCals.map(c => c.title)) + ";window.__LQ_PAYS__=" + js(pays) + ";window.__LQ_PAYLISTS__=" + js(payCals.map(c => c.title)) + ";</script>";
  html = html.replace("<head>", "<head>" + boot)
    // フォントの読み込みを待たずに表示する
    .replace(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/, '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'">');

  const wv = new WebView();
  let open = true;
  wv.loadHTML(html, GAME_URL);
  // 表示のしかた:ゲームの設定(ステータス →「画面の開き方」)で選ぶ。全画面 or 下から出るシート
  let fullscreen = false;
  try { fullscreen = (JSON.parse(saved || "null") || {}).viewMode === "full"; } catch(e) {}
  const shown = wv.present(fullscreen).then(() => { open = false; }, () => { open = false; });
  // 取れなかったときは、次回のために裏で取っておく
  if (!fresh) fetchGame(10);
  // 1秒ごとに、ゲームのセーブと頼まれた操作を受け取る
  const TAKE = "(function(){var s=window.__lqPending||null;window.__lqPending=null;var o=window.__lqOps||[];window.__lqOps=[];return JSON.stringify({s:s,o:o});})()";
  async function drain(){
    let r = null;
    try { r = JSON.parse(await wv.evaluateJavaScript(TAKE, false)); } catch(e) { return; }
    if (r.s) writeSave(r.s);
    let added = false, remAdded = false, wishChanged = false, payChanged = false;
    for (const op of r.o || []) {
      try {
        if (op.type === "rem") {
          const rem = remMap.get(op.id);
          if (rem) { rem.isCompleted = !!op.done; rem.save(); }
        } else if (op.type === "addPay") {
          let cal = payCals.find(c => c.title === op.list) || (op.list === "支払い" ? null : payCals[0]);
          if (!cal) { cal = await Calendar.createForReminders("支払い"); payCals = payCals.concat([cal]); }
          const r = new Reminder();
          r.title = String(op.title || "支払い");
          if (op.due) { r.dueDate = new Date(op.due); r.dueDateIncludesTime = false; }
          if (op.amount) r.notes = Number(op.amount).toLocaleString("ja-JP") + "円";
          r.calendar = cal;
          r.save();
          payChanged = true;
        } else if (op.type === "payDone") {
          const r = payMap.get(op.id);
          if (r) { r.isCompleted = true; r.save(); }
        } else if (op.type === "buyWish") {
          const r = wishMap.get(op.id);
          if (r) { r.isCompleted = true; r.save(); }
        } else if (op.type === "setWishPrice") {
          const r = wishMap.get(op.id);
          if (r) { r.notes = setPriceInNotes(r.notes, op.price); r.save(); }
        } else if (op.type === "addWish") {
          if (wishCal) {
            const r = new Reminder();
            r.title = String(op.title || "ほしいもの");
            r.notes = op.price + "G";
            r.calendar = wishCal;
            r.save();
            wishChanged = true;
          }
        } else if (op.type === "makeWishList") {
          if (!wishCal) { wishCal = await Calendar.createForReminders(WISH_NAME); }
          wishChanged = true;
        } else if (op.type === "editRem") {
          const r = remMap.get(op.id);
          if (r) {
            r.title = String(op.title || r.title);
            if (op.due) { r.dueDate = new Date(op.due); r.dueDateIncludesTime = !!op.hasTime; }
            else { r.dueDate = null; r.dueDateIncludesTime = false; }
            r.priority = op.high ? 1 : (r.priority >= 1 && r.priority <= 4 ? 0 : r.priority || 0);
            const cal = remCals.find(c => c.title === op.list);
            if (cal && (!r.calendar || r.calendar.title !== cal.title)) r.calendar = cal;
            r.save();
            remAdded = true;
          }
        } else if (op.type === "deleteRem") {
          const r = remMap.get(op.id);
          if (r) { r.remove(); remMap.delete(op.id); remAdded = true; }
        } else if (op.type === "addRem") {
          const r = new Reminder();
          r.title = String(op.title || "リマインダー");
          if (op.due) { r.dueDate = new Date(op.due); r.dueDateIncludesTime = !!op.hasTime; }
          r.priority = op.high ? 1 : 0;
          const cal = remCals.find(c => c.title === op.list) || remCals[0];
          if (cal) r.calendar = cal;
          r.save();
          remAdded = true;
        } else if (op.type === "obsTask") {
          await obsSetTask(op.id, !!op.done);
        } else if (op.type === "loadMonth") {
          // こよみで範囲外の月を開いたとき:その月の予定を読み込んで渡す
          const [y, m] = String(op.ym).split("-").map(Number);
          const from = new Date(y, m - 1, 1), to = new Date(y, m, 1);
          const list = await monthEvents(from, to);
          await wv.evaluateJavaScript("window.__lqAddMonth(" + js(op.ym) + "," + js(list || []) + ");0", false);
        } else if (op.type === "editEvent") {
          const ev = eventMap.get(op.k);
          if (ev) {
            ev.title = String(op.title || ev.title);
            ev.isAllDay = !!op.allDay;
            ev.startDate = new Date(op.start);
            ev.endDate = new Date(op.allDay ? op.start + 86399000 : op.end);
            if (op.cal && ev.calendar && ev.calendar.title !== op.cal) { const c = evCals.find(x => x.title === op.cal); if (c) ev.calendar = c; }
            ev.save();
            added = true;
          }
        } else if (op.type === "deleteEvent") {
          const ev = eventMap.get(op.k);
          if (ev) { ev.remove(); added = true; }
        } else if (op.type === "addEvent") {
          const ev = new CalendarEvent();
          ev.title = String(op.title || "予定");
          ev.isAllDay = !!op.allDay;
          ev.startDate = new Date(op.start);
          ev.endDate = new Date(op.allDay ? op.start + 86399000 : op.end);
          ev.calendar = await findEvCal(op.cal);
          ev.save();
          added = true;
        }
      } catch(e) {}
    }
    if (payChanged) {
      try { const list = await loadPays(); await wv.evaluateJavaScript("window.__lqSetPays(" + js(list) + "," + js(payCals.map(c => c.title)) + ");0", false); } catch(e) {}
    }
    if (wishChanged) {
      try { const list = await loadWishes(); await wv.evaluateJavaScript("window.__lqSetWishes(" + js(list) + ");0", false); } catch(e) {}
    }
    if (remAdded) {
      try { const list = await loadReminders(); await wv.evaluateJavaScript("window.__lqSetRems(" + js(list) + "," + js(remAll) + ");0", false); } catch(e) {}
    }
    if (added) {
      try {
        const te = await todayEvents(), me = await monthEvents();
        await wv.evaluateJavaScript("window.__lqSetEvents(" + js(te) + "," + js(me) + ");0", false);
      } catch(e) {}
    }
  }
  // Obsidian は、ゲームが表示されてから読み込んで渡す。
  // ゲームとのやりとりは1つずつ順番に行う(同時に呼ぶと Scriptable が固まることがあるため)
  let obsData = null, obsSent = false, obsTried = false;
  while (open) {
    await wait(1000);
    await drain();
    if (!obsTried && open) {
      obsTried = true;
      try { obsData = await loadObsidian(); } catch(e) { obsData = { ok: false, reason: "error", error: String(e) }; }
    }
    if (obsData && !obsSent && open) {
      try {
        const ready = await wv.evaluateJavaScript("typeof window.__lqSetObs === 'function'", false);
        if (ready) { await wv.evaluateJavaScript("window.__lqSetObs(" + js(obsData) + ");0", false); obsSent = true; }
      } catch(e) { obsSent = true; }
    }
  }
  await shown;
  await drain();
  try { await writeDiary(loadSave()); } catch(e) {}
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
  const wx = await getWeather(60);
  const hToday = loadHealth()[t] || null;
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
  if (!String(family).startsWith("accessory")) w.backgroundColor = C.sky;
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
    const im = top.addImage(spriteImage(lookKey(st, L.lv), 3)); im.imageSize = new Size(44, 44);
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
    const ul = untilLabel(e); if (ul) text(row, ul, size - 3, C.gold);
    if (nowIn) text(row, "いま", 11, C.gold, true);
  }
  function eventsBlock(max, size){
    const head = w.addStack(); head.centerAlignContent();
    text(head, "今日の予定", 13, C.gold, true);
    head.addSpacer();
    const d = new Date(now);
    text(head, (d.getMonth()+1) + "/" + d.getDate() + "(" + "日月火水木金土"[d.getDay()] + ")" + (wx ? "  " + wxIcon(wx.now.code) + Math.round(wx.now.t) + "°" : ""), 12, C.dim);
    w.addSpacer(4);
    if (!upcoming.length) {
      text(w, evsRaw ? "今日はこのあと予定なし" : "タップしてカレンダーを許可してください", size - 1, C.dim);
      // 今日の予定がないときは、近々の予定を出す
      if (evsRaw && soon.length && family !== "large" && family !== "extraLarge") { w.addSpacer(2); soonLines(Math.max(1, max - 1)); }
    }
    for (const e of upcoming.slice(0, max)) { eventLine(w, e, size); w.addSpacer(2); }
    if (upcoming.length > max) text(w, "ほか " + (upcoming.length - max) + "件", 11, C.dim);
  }
  function footer(){
    const row = w.addStack(); row.centerAlignContent(); row.spacing = 6;
    const im = row.addImage(spriteImage(lookKey(st, L.lv), 2)); im.imageSize = new Size(24, 24);
    text(row, "Lv" + L.lv, 15, C.ink, true);
    if (family !== "small") bar(row, L.cur/L.need, 8);
    row.addSpacer();
    text(row, "デイリー " + nDone + "/" + quests.length, 13, nDone === quests.length ? C.gold : C.dim);
  }
  function footer2(){
    const row = w.addStack(); row.centerAlignContent(); row.spacing = 4;
    text(row, (st ? st.gold || 0 : 0) + "G ・ 連続" + streak + "日" + (hToday && hToday.steps != null ? " ・ 👣" + hToday.steps.toLocaleString("ja-JP") : "") + (remsLeft.length ? " ・ リマインダー" + remsLeft.length : ""), 12, C.dim);
    row.addSpacer();
    const d = row.addDate(nextReset(now)); d.applyTimerStyle(); d.font = Font.mediumMonospacedSystemFont(12); d.textColor = C.dim; d.rightAlignText();
  }

  // 空いた行を埋めるための材料
  const tomorrow = await tomorrowEvents();
  const soon = await soonEvents(7);
  const dayLabel = ms => { const d = new Date(ms), gd = gameDate(now); const n = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(gd.getFullYear(), gd.getMonth(), gd.getDate())) / 864e5);
    return (n === 1 ? "明日" : n === 2 ? "あさって" : (d.getMonth()+1) + "/" + d.getDate()) + "(" + "日月火水木金土"[d.getDay()] + ")"; };
  function soonLines(max){
    for (const e of soon.slice(0, max)) {
      const row = w.addStack(); row.centerAlignContent(); row.spacing = 6;
      const tm = row.addText(dayLabel(e.start) + (e.allDay ? "" : " " + hm(e.start)));
      tm.font = Font.mediumMonospacedSystemFont(12); tm.textColor = (SHIFT_RE.test(e.title || "") || SHIFT_RE.test(e.cal || "")) ? C.gold : C.dim; tm.lineLimit = 1;
      text(row, e.title || "予定", 14, C.ink);
      const ul = untilLabel(e); if (ul) text(row, ul, 11, C.gold);
    }
  }
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

  // 今日の予定が少ないときは、近々の予定を優先して、なければ「次にやること」
  function fillSoonOrNext(n){
    if (soon.length) { w.addSpacer(6); sectionTitle("近々の予定"); soonLines(n); }
    else fillNext(n);
  }
  /* ---- 1週間の予定(ウィジェットの「Parameter」に「週」と入れたとき) ---- */
  const param = String((typeof args !== "undefined" && args.widgetParameter) || "").trim();
  if (/週|week/i.test(param) && !String(family).startsWith("accessory")) {
    const gd = gameDate(now);
    const days = [];
    for (let i = 0; i < 7; i++) {
      let list = [];
      try { list = (await eventsForDay(i)).map(mapEvent); } catch(e) {}
      days.push({ date: new Date(gd.getFullYear(), gd.getMonth(), gd.getDate() + i), list });
    }
    let pays = [];
    try { pays = (await loadPays()) || []; } catch(e) {}
    const d0 = days[0].date, d6 = days[6].date;
    const head = w.addStack(); head.centerAlignContent();
    text(head, "1週間の予定", 13, C.gold, true);
    head.addSpacer();
    text(head, (d0.getMonth()+1) + "/" + d0.getDate() + "〜" + (d6.getMonth()+1) + "/" + d6.getDate(), 11, C.dim);
    w.addSpacer(family === "large" ? 6 : 3);
    const perDay = family === "large" || family === "extraLarge" ? 2 : 1;
    const showDays = family === "small" ? 4 : 7;
    for (const [i, d] of days.slice(0, showDays).entries()) {
      const ds = ymd(d.date);
      const dayPays = pays.filter(p => p.due && ymd(new Date(p.due)) === ds);
      const items = d.list.map(e => ({ time: e.allDay ? "終日" : hm(e.start), title: e.title || "予定",
          shift: SHIFT_RE.test(e.title || "") || SHIFT_RE.test(e.cal || ""), cont: e.start < d.date.getTime() }))
        .concat(dayPays.map(p => ({ time: "支払", title: p.title, pay: true })));
      const row = w.addStack(); row.spacing = 6; row.topAlignContent();
      const lab = row.addStack(); lab.size = new Size(family === "small" ? 34 : 46, 0);
      const wd = d.date.getDay();
      const lt = lab.addText(i === 0 ? "今日" : d.date.getDate() + " " + "日月火水木金土"[wd]);
      lt.font = Font.boldSystemFont(family === "large" ? 13 : 12); lt.lineLimit = 1; lt.minimumScaleFactor = 0.7;
      lt.textColor = i === 0 ? C.gold : wd === 0 ? C.danger : wd === 6 ? C.int : C.ink;
      const col = row.addStack(); col.layoutVertically(); col.spacing = 1;
      if (!items.length) { text(col, "—", family === "large" ? 13 : 12, C.dim); }
      for (const it of items.slice(0, perDay)) {
        const r = col.addStack(); r.spacing = 5; r.centerAlignContent();
        const tm = r.addText(it.time); tm.font = Font.mediumMonospacedSystemFont(family === "large" ? 12 : 11);
        tm.textColor = it.pay ? C.bond : it.shift ? C.gold : C.dim; tm.lineLimit = 1;
        text(r, (it.cont ? "(続き) " : "") + it.title, family === "large" ? 13 : 12, it.cont ? C.dim : C.ink);
      }
      if (items.length > perDay) text(col, "ほか" + (items.length - perDay) + "件", 10, C.dim);
      if (i < showDays - 1) w.addSpacer(family === "large" ? 4 : 2);
    }
    w.addSpacer();
    return w;
  }

  /* ---- ロック画面ウィジェット ---- */
  // 次の予定:今日のこのあと → なければ近々の予定
  const nextUp = upcoming.find(e => !e.allDay && e.end > now.getTime()) || upcoming[0] || null;
  const nextLabel = nextUp ? (nextUp.allDay ? "今日" : hm(nextUp.start)) + " " + (nextUp.title || "予定")
    : soon.length ? dayLabel(soon[0].start) + (soon[0].allDay ? "" : " " + hm(soon[0].start)) + " " + (soon[0].title || "予定")
    : "予定なし";
  const nextTodo = remsLeft.length ? remsLeft[0].title : openQuests.length ? openQuests[0].t : "";
  // 天気と歩数の短い表記(ロック画面用)
  const wxShort = wx && wx.now ? wxIcon(wx.now.code) + Math.round(wx.now.t) + "°" : "";
  const stepsShort = hToday && hToday.steps != null ? "👣" + hToday.steps.toLocaleString("ja-JP") : "";
  const lockParam = param; // ウィジェットの「Parameter」:予定 / 天気 / 歩数 / Lv / デイリー
  if (family === "accessoryInline") {
    // 時計の上の1行(Parameter:天気 → 天気と気温、歩数 → 歩数、それ以外 → Lv・デイリー・次の予定)
    let line;
    if (/天気|weather/i.test(lockParam) && wx) { const d0 = (wx.days || [])[0]; line = wxShort + (d0 ? " " + Math.round(d0.max) + "°/" + Math.round(d0.min) + "° ☂" + (d0.pop ?? "-") + "%" : ""); }
    else if (/歩|step/i.test(lockParam)) line = stepsShort ? stepsShort + "歩" : "👣 まだ届いていません";
    else line = "Lv" + L.lv + " ・ デイリー" + nDone + "/" + quests.length + (wxShort ? " ・ " + wxShort : "") + " ・ " + nextLabel;
    const t = w.addText(line);
    t.font = Font.systemFont(12); t.lineLimit = 1; t.minimumScaleFactor = 0.6;
    return w;
  }
  if (family === "accessoryCircular") {
    w.addAccessoryWidgetBackground = true;
    w.setPadding(0, 0, 0, 0);
    // 進み具合の輪(0〜1)を描く
    const ring = ratio => {
      const n = 60, ctx = new DrawContext(); ctx.size = new Size(n, n); ctx.opaque = false; ctx.respectScreenScale = true;
      const arc = (from, to, alpha) => {
        const pts = [], steps = Math.max(2, Math.round((to - from) * 60));
        for (let i = 0; i <= steps; i++) { const a = -Math.PI / 2 + (from + (to - from) * i / steps) * Math.PI * 2; pts.push(new Point(n / 2 + 26 * Math.cos(a), n / 2 + 26 * Math.sin(a))); }
        const p = new Path(); p.addLines(pts); ctx.addPath(p); ctx.setStrokeColor(new Color("#ffffff", alpha)); ctx.setLineWidth(4); ctx.strokePath();
      };
      arc(0, 1, 0.25);
      if (ratio > 0) arc(0, Math.min(1, ratio), 1);
      return ctx.getImage();
    };
    const center = (lines) => {
      const col = w.addStack(); col.layoutVertically(); col.centerAlignContent();
      for (const [str, size, bold] of lines) {
        const r = col.addStack(); r.addSpacer(); const tx = r.addText(str);
        tx.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size); tx.lineLimit = 1; tx.minimumScaleFactor = 0.6; r.addSpacer();
      }
    };
    if (/歩|step/i.test(lockParam)) {
      // 歩数:8,000歩までの輪 + 歩数
      const st = hToday && hToday.steps != null ? hToday.steps : null;
      w.backgroundImage = ring(st != null ? st / 8000 : 0);
      center([["👣", 10], [st != null ? (st >= 10000 ? (st / 1000).toFixed(1) + "k" : st.toLocaleString("ja-JP")) : "--", st != null && st >= 1000 ? 12 : 14, true]]);
    } else if (/天気|weather/i.test(lockParam)) {
      const d0 = wx && wx.days ? wx.days[0] : null;
      center([[wx ? wxIcon(wx.now.code) : "?", 18], [wx ? Math.round(wx.now.t) + "°" : "--", 13, true], [d0 ? "☂" + (d0.pop ?? "-") + "%" : "", 8]]);
    } else if (/^lv|レベル/i.test(lockParam)) {
      w.backgroundImage = ring(L.cur / L.need);
      center([["Lv", 9], [String(L.lv), 18, true]]);
    } else {
      // デイリー:輪 + 達成数
      w.backgroundImage = ring(quests.length ? nDone / quests.length : 0);
      center([["Lv" + L.lv, 9], [nDone + "/" + quests.length, 16, true], [nDone === quests.length ? "★" : "デイリー", 7]]);
    }
    return w;
  }
  if (family === "accessoryRectangular") {
    w.setPadding(0, 0, 0, 0);
    const line = (str, size, bold, op) => { const t = w.addText(str); t.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size); t.lineLimit = 1; t.minimumScaleFactor = 0.7; if (op) t.textOpacity = op; return t; };
    if (/予定|schedule/i.test(lockParam)) {
      // 予定:このあとの予定を3件(なければ近々の予定)
      const list = upcoming.filter(e => e.allDay || e.end > now.getTime()).map(e => (e.allDay ? "終日 " : hm(e.start) + " ") + (e.title || "予定"))
        .concat(soon.map(e => dayLabel(e.start) + (e.allDay ? " " : " " + hm(e.start) + " ") + (e.title || "予定"))).slice(0, 3);
      if (!list.length) line("予定はありません", 13, true);
      list.forEach((x, i) => line((i === 0 ? "▶ " : "・") + x, i === 0 ? 13 : 11, i === 0, i === 0 ? 0 : 0.85));
      return w;
    }
    // ふだん:次の予定 / Lv・デイリー・天気・歩数 / 次にやること
    line("▶ " + nextLabel, 13, true);
    const ul = nextUp ? untilLabel(nextUp) : "";
    line(["Lv" + L.lv, "デイリー" + nDone + "/" + quests.length, wxShort, stepsShort, ul].filter(Boolean).join(" ・ "), 11, false, 0.85);
    if (nextTodo) line((remsLeft.length ? "! " : "・") + nextTodo, 11, false, 0.85);
    else line(nDone === quests.length ? "★ デイリー全部クリア！" : "このあとは ゆっくり", 11, false, 0.85);
    return w;
  }

  if (family === "small") {
    eventsBlock(2, 14);
    if (upcoming.length === 1) fillSoonOrNext(1);
    w.addSpacer();
    footer();
  } else if (family === "medium") {
    eventsBlock(3, 15);
    if (upcoming.length === 1) fillSoonOrNext(1);
    w.addSpacer();
    footer();
    w.addSpacer(2);
    footer2();
  } else {
    // 大:だいたい15行ぶん。予定 → ステータスとデイリー → 残りの行を埋める → ウィークリー
    const shownEv = Math.min(upcoming.length, 4);
    eventsBlock(4, 15);
    let used = 1 + Math.max(shownEv, 1) + (upcoming.length > 4 ? 1 : 0);
    if (shownEv < 3 && soon.length) {
      w.addSpacer(6);
      sectionTitle("近々の予定");
      const n = Math.min(3 - shownEv, soon.length);
      soonLines(n);
      used += 1 + n;
    }
    w.addSpacer();
    const main = w.addStack(); main.spacing = 12;
    const left = main.addStack(); left.layoutVertically(); left.size = new Size(135, 0);
    statusBlock(left);
    const right = main.addStack(); right.layoutVertically(); right.spacing = 4;
    text(right, "デイリーミッション " + nDone + "/" + quests.length, 12, C.dim);
    // 達成済み・期限切れは出さず、のこりのミッションだけ並べる
    const left5 = quests.filter(q => !done.has(q.id) && questState(q, now) !== "expired");
    if (!left5.length) text(right, nDone === quests.length ? "★ 全部クリア！" : "今日のミッションは おしまい", 14, nDone === quests.length ? C.gold : C.dim, true);
    for (const q of left5) questLine(right, q);
    used += 7;
    let room = 15 - used - 1; // 最後の1行はウィークリー
    if (remsLeft.length && room >= 2) {
      w.addSpacer();
      const n = Math.min(remsLeft.length, room - 1, 3);
      sectionTitle("リマインダー", "のこり" + remsLeft.length + "件");
      for (const r of remsLeft.slice(0, n)) itemLine(r.overdue ? "!" : "▶", r.overdue ? C.danger : C.gold, r.title || "リマインダー", C.ink);
      room -= n + 1;
    }
    // 次に買えそうなきせかえ(目標として表示)
    const owned = st && st.wardrobe && st.wardrobe.owned ? st.wardrobe.owned : {};
    const goal = COSTUMES.filter(c => !owned[c[0]]).sort((a,b) => a[2] - b[2])[0];
    if (goal && room >= 1) {
      w.addSpacer();
      const gr = w.addStack(); gr.centerAlignContent(); gr.spacing = 6;
      const gi = gr.addImage(spriteImage("c:" + goal[0], 2)); gi.imageSize = new Size(26, 26);
      const gold = st ? st.gold || 0 : 0;
      text(gr, gold >= goal[2] ? "きせかえ「" + goal[1] + "」が買える！" : "きせかえ「" + goal[1] + "」まで あと" + (goal[2] - gold) + "G", 13, gold >= goal[2] ? C.gold : C.dim);
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

const shortcutParam = typeof args !== "undefined" ? args.shortcutParameter : null;
if (shortcutParam !== null && shortcutParam !== undefined && !config.runsInWidget) {
  // ショートカットから呼ばれたとき:歩数・睡眠を記録するだけ(画面は出さない)
  await receiveHealth(shortcutParam);
} else if (config.runsInWidget) {
  Script.setWidget(await buildWidget());
} else {
  try { await openGame(); }
  catch(e) {
    const a = new Alert(); a.title = "エラーが起きました"; a.message = String(e); a.addAction("OK"); await a.present();
  }
}
Script.complete();
