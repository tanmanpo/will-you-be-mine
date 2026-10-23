/* ============================================================
   EDIT THIS PART TO MAKE IT YOURS
   ============================================================ */
const CONFIG = {
  yourName: "",        // signs the letter, e.g. "Mike"
  knownSince: "",      // optional date like "2026-02-14"; leave "" to hide
  daysLabel: "days since we met",
  letter: [
    "I’m not great at big speeches, so I built this instead.",
    "Thank you for the way you make ordinary days feel lighter.",
    "I can’t promise a perfect story, but I can promise to show up, be honest, and keep making you laugh.",
    "Thank you for saying yes."
  ]
};

/* ============================================================
   SETUP
   ============================================================ */
const $ = (id) => document.getElementById(id);

const stages = {
  name: $("stage-name"),
  ask: $("stage-ask"),
  yes: $("stage-yes")
};

const yesBtn = $("yes");
const noBtn = $("no");
const taunt = $("taunt");
const count = $("count");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let name = "";
let tries = 0;
let lastDodge = 0;
let typer = null;

function show(stage) {
  Object.values(stages).forEach((s) => s.classList.remove("active"));
  stages[stage].classList.add("active");
}

/* ============================================================
   BACKGROUND HEARTS (gentle, always on)
   ============================================================ */
(function makeSky() {
  const sky = $("sky");
  const glyphs = ["💖", "💗", "💕"];
  for (let i = 0; i < 14; i++) {
    const h = document.createElement("span");
    h.textContent = glyphs[i % glyphs.length];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 16 + Math.random() * 22 + "px";
    h.style.animationDuration = 9 + Math.random() * 9 + "s";
    h.style.animationDelay = Math.random() * 12 + "s";
    sky.appendChild(h);
  }
})();

/* ============================================================
   STAGE 1: NAME
   ============================================================ */
const fromLink = new URLSearchParams(window.location.search).get("to");

function startQuestion() {
  $("question").textContent = name ? name + ", will you be mine?" : "Will you be mine?";
  show("ask");
}

$("start").addEventListener("click", function () {
  name = $("name-input").value.trim();
  startQuestion();
});

$("name-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") $("start").click();
});

if (fromLink) {
  // A link like ...?to=Anna skips the name stage
  name = fromLink.trim().slice(0, 30);
  startQuestion();
}

/* ============================================================
   STAGE 2: THE RUNAWAY NO BUTTON
   ============================================================ */
const taunts = [
  "Nice try.",
  "Are you sure?",
  "Think again…",
  "That button seems broken.",
  "Have you seen how big Yes is getting?",
  "Okay, now you’re just teasing me.",
  "It really won’t let you.",
  "Just press Yes already."
];

function overlaps(x, y, w, h, r) {
  return x < r.right && x + w > r.left && y < r.bottom && y + h > r.top;
}

function growYes() {
  const scale = Math.min(1 + tries * 0.12, 1.9);
  yesBtn.style.setProperty("--grow", scale);
}

function dodge(e) {
  if (e && e.cancelable) e.preventDefault();

  // Touch fires several events at once; count only one
  const now = Date.now();
  if (now - lastDodge < 200) return;
  lastDodge = now;

  tries++;
  growYes();

  // First dodge: pin the button where it is, then let it fly
  if (!noBtn.classList.contains("loose")) {
    const r = noBtn.getBoundingClientRect();
    noBtn.style.left = r.left + "px";
    noBtn.style.top = r.top + "px";
    noBtn.classList.add("loose");
    void noBtn.offsetWidth;
  }

  const pad = 12;
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const yesRect = yesBtn.getBoundingClientRect();

  let x, y;
  let attempts = 0;
  do {
    x = pad + Math.random() * Math.max(window.innerWidth - w - pad * 2, 0);
    y = pad + Math.random() * Math.max(window.innerHeight - h - pad * 2, 0);
    attempts++;
  } while (overlaps(x, y, w, h, yesRect) && attempts < 30);

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  taunt.textContent = taunts[Math.min(tries - 1, taunts.length - 1)];
  count.textContent = "No has escaped " + tries + (tries === 1 ? " time." : " times.");
}

noBtn.addEventListener("pointerenter", dodge);
noBtn.addEventListener("pointerdown", dodge);
noBtn.addEventListener("focus", dodge);
noBtn.addEventListener("click", dodge);

/* ============================================================
   STAGE 3: SHE SAID YES
   ============================================================ */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let raf = null;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const burstGlyphs = ["💖", "💗", "💕", "✨", "🌹"];

function burst(amount) {
  for (let i = 0; i < amount; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
    const speed = 8 + Math.random() * 11;
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.65,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 18 + Math.random() * 22,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.2,
      glyph: burstGlyphs[Math.floor(Math.random() * burstGlyphs.length)]
    });
  }
  if (!raf) loop();
}

function loop() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  pieces.forEach((p) => {
    p.vy += 0.25;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.font = p.size + "px serif";
    ctx.fillText(p.glyph, 0, 0);
    ctx.restore();
  });

  pieces = pieces.filter((p) => p.y < window.innerHeight + 60);

  if (pieces.length) {
    raf = requestAnimationFrame(loop);
  } else {
    raf = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function finishLetter() {
  if (CONFIG.yourName) {
    const sig = $("signature");
    sig.textContent = "— " + CONFIG.yourName;
    sig.classList.remove("hidden");
  }

  if (CONFIG.knownSince) {
    const start = new Date(CONFIG.knownSince + "T00:00:00");
    const days = Math.floor((Date.now() - start.getTime()) / 86400000);
    if (!isNaN(days) && days >= 0) {
      const el = $("days");
      el.textContent = days.toLocaleString() + " " + CONFIG.daysLabel + ", and counting.";
      el.classList.remove("hidden");
    }
  }

  $("replay").classList.remove("hidden");
}

function typeLetter() {
  const box = $("letter");
  const text = CONFIG.letter.join("\n\n");
  let i = 0;

  clearInterval(typer);
  box.textContent = "";

  if (reduceMotion) {
    box.textContent = text;
    finishLetter();
    return;
  }

  typer = setInterval(function () {
    i++;
    box.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(typer);
      finishLetter();
    }
  }, 32);
}

function celebrate() {
  show("yes");
  $("win-title").textContent = name ? name + ", you said yes." : "You said yes.";

  if (!reduceMotion) {
    burst(60);
    setTimeout(function () { burst(50); }, 500);
    setTimeout(function () { burst(40); }, 1100);
  }

  typeLetter();
}

yesBtn.addEventListener("click", celebrate);

/* ============================================================
   PLAY AGAIN
   ============================================================ */
$("replay").addEventListener("click", function () {
  clearInterval(typer);
  tries = 0;

  noBtn.classList.remove("loose");
  noBtn.style.left = "";
  noBtn.style.top = "";
  yesBtn.style.removeProperty("--grow");

  taunt.textContent = "Take your time.";
  count.textContent = "";

  $("signature").classList.add("hidden");
  $("days").classList.add("hidden");
  $("replay").classList.add("hidden");

  show("ask");
});
