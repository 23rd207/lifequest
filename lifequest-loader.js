// ライフクエスト ローダー(Scriptable 用)
// これを1回だけ貼っておけば、本体のスクリプトは GitHub から自動で最新版になります。
// ・ウィジェットからタップして開いたとき … 毎回、最新版を確認
// ・ホーム画面のウィジェット表示 … 6時間に1回だけ確認(表示を速くするため)
// 電波がないときは、前に取ってきた版で動きます。
// icon-color: deep-blue; icon-glyph: magic;

const CORE_URL = "https://raw.githubusercontent.com/23rd207/lifequest/main/lifequest-widget.js";
const fm = FileManager.local();
const dir = fm.documentsDirectory();
const CORE = fm.joinPath(dir, "lifequest-core.js");
const STAMP = fm.joinPath(dir, "lifequest-core.time");

let code = fm.fileExists(CORE) ? fm.readString(CORE) : null;
const last = fm.fileExists(STAMP) ? Number(fm.readString(STAMP)) || 0 : 0;
const checkEvery = config.runsInWidget ? 6 * 3600e3 : 0;

if (!code || Date.now() - last > checkEvery) {
  try {
    const req = new Request(CORE_URL + "?t=" + Date.now());
    req.timeoutInterval = code ? 5 : 15;
    const fresh = await req.loadString();
    const ok = req.response && req.response.statusCode === 200;
    if (ok && fresh && fresh.includes("ライフクエスト") && fresh.includes("buildWidget")) {
      fm.writeString(CORE, fresh);
      fm.writeString(STAMP, String(Date.now()));
      code = fresh;
    }
  } catch (e) {}
}

if (!code) {
  if (config.runsInWidget) {
    const w = new ListWidget();
    w.backgroundColor = new Color("#0b0e2b");
    const t = w.addText("ライフクエスト:タップして準備");
    t.textColor = new Color("#f3f1ff"); t.font = Font.systemFont(13);
    Script.setWidget(w);
  } else {
    const a = new Alert();
    a.title = "ライフクエストを読み込めませんでした";
    a.message = "はじめの1回はインターネットにつながった状態で開いてください。";
    a.addAction("OK");
    await a.present();
  }
  Script.complete();
} else {
  // 取ってきた本体を、このスクリプトの中で動かす
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  await new AsyncFunction(code)();
}
