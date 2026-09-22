(function () {
  "use strict";

  // ---------------- Persistence ----------------
  const LS_SETTINGS = "imposter_settings_v1";
  const LS_CUSTOM = "imposter_custom_categories_v1";
  const LS_SCORE = "imposter_scoreboard_v1";

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
  }

  function defaultSettings() {
    return {
      numPlayers: 4,
      playerNames: ["", "", "", ""],
      numImposters: 1,
      timerMinutes: 3,
      hintCategory: true,
      stealEnabled: true,
      selectedCategories: CATEGORY_NAMES.slice()
    };
  }

  let settings = Object.assign(defaultSettings(), loadJSON(LS_SETTINGS, {}));
  if (!Array.isArray(settings.playerNames) || settings.playerNames.length !== settings.numPlayers) {
    settings.playerNames = Array.from({ length: settings.numPlayers }, (_, i) => settings.playerNames[i] || "");
  }
  let customCategories = loadJSON(LS_CUSTOM, {});
  let scoreboard = loadJSON(LS_SCORE, { crew: 0, imposter: 0 });

  function persistSettings() { saveJSON(LS_SETTINGS, settings); }
  function persistCustom() { saveJSON(LS_CUSTOM, customCategories); }
  function persistScore() { saveJSON(LS_SCORE, scoreboard); }

  function getAllCategories() {
    return Object.assign({}, WORD_CATEGORIES, customCategories);
  }

  function vibrate(ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* ignore */ }
  }

  // ---------------- Screen management ----------------
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0, 0);
  }

  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.getAttribute("data-back")));
  });

  // ---------------- Home / scoreboard ----------------
  function renderScoreboard() {
    const el = document.getElementById("scoreboard");
    const total = scoreboard.crew + scoreboard.imposter;
    el.textContent = total === 0
      ? "No rounds played yet"
      : `Crew ${scoreboard.crew} — Imposters ${scoreboard.imposter}`;
  }
  renderScoreboard();

  document.getElementById("btn-play").addEventListener("click", () => {
    initSetupScreen();
    showScreen("screen-setup");
  });
  document.getElementById("btn-settings").addEventListener("click", () => {
    initSetupScreen();
    showScreen("screen-setup");
  });
  document.getElementById("btn-howto").addEventListener("click", () => showScreen("screen-howto"));
  document.getElementById("btn-reset-score").addEventListener("click", () => {
    scoreboard = { crew: 0, imposter: 0 };
    persistScore();
    renderScoreboard();
  });

  // ---------------- Setup screen ----------------
  function clampImposters() {
    const maxImp = Math.max(1, settings.numPlayers - 2);
    if (settings.numImposters > maxImp) settings.numImposters = maxImp;
    if (settings.numImposters < 1) settings.numImposters = 1;
  }

  function renderPlayerNameInputs() {
    const wrap = document.getElementById("player-names-list");
    wrap.innerHTML = "";
    for (let i = 0; i < settings.numPlayers; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 18;
      input.placeholder = `Player ${i + 1}`;
      input.value = settings.playerNames[i] || "";
      input.addEventListener("input", () => { settings.playerNames[i] = input.value; });
      wrap.appendChild(input);
    }
  }

  function renderCategoryChips() {
    const wrap = document.getElementById("category-chips");
    wrap.innerHTML = "";
    const all = getAllCategories();
    Object.keys(all).forEach((name) => {
      const chip = document.createElement("div");
      chip.className = "chip" + (settings.selectedCategories.includes(name) ? " selected" : "");
      chip.textContent = name;
      chip.addEventListener("click", () => {
        const idx = settings.selectedCategories.indexOf(name);
        if (idx >= 0) settings.selectedCategories.splice(idx, 1);
        else settings.selectedCategories.push(name);
        chip.classList.toggle("selected");
      });
      wrap.appendChild(chip);
    });
  }

  function initSetupScreen() {
    document.getElementById("players-val").textContent = settings.numPlayers;
    document.getElementById("imposters-val").textContent = settings.numImposters;
    document.getElementById("timer-val").textContent = settings.timerMinutes === 0 ? "Off" : `${settings.timerMinutes} min`;
    document.getElementById("toggle-hint").checked = settings.hintCategory;
    document.getElementById("toggle-steal").checked = settings.stealEnabled;
    renderPlayerNameInputs();
    renderCategoryChips();
  }

  document.getElementById("players-minus").addEventListener("click", () => {
    if (settings.numPlayers > 3) {
      settings.numPlayers--;
      settings.playerNames.length = settings.numPlayers;
      clampImposters();
      initSetupScreen();
    }
  });
  document.getElementById("players-plus").addEventListener("click", () => {
    if (settings.numPlayers < 20) {
      settings.numPlayers++;
      settings.playerNames.push("");
      initSetupScreen();
    }
  });
  document.getElementById("imposters-minus").addEventListener("click", () => {
    if (settings.numImposters > 1) { settings.numImposters--; initSetupScreen(); }
  });
  document.getElementById("imposters-plus").addEventListener("click", () => {
    const maxImp = Math.max(1, settings.numPlayers - 2);
    if (settings.numImposters < maxImp) { settings.numImposters++; initSetupScreen(); }
  });
  document.getElementById("timer-minus").addEventListener("click", () => {
    if (settings.timerMinutes > 0) { settings.timerMinutes = Math.max(0, settings.timerMinutes - 1); initSetupScreen(); }
  });
  document.getElementById("timer-plus").addEventListener("click", () => {
    if (settings.timerMinutes < 15) { settings.timerMinutes++; initSetupScreen(); }
  });
  document.getElementById("toggle-hint").addEventListener("change", (e) => { settings.hintCategory = e.target.checked; });
  document.getElementById("toggle-steal").addEventListener("change", (e) => { settings.stealEnabled = e.target.checked; });

  document.getElementById("btn-manage-words").addEventListener("click", () => {
    renderCustomList();
    showScreen("screen-custom");
  });

  // ---------------- Custom words ----------------
  function renderCustomList() {
    const wrap = document.getElementById("custom-cat-list");
    wrap.innerHTML = "";
    Object.keys(customCategories).forEach((name) => {
      const row = document.createElement("div");
      row.className = "custom-cat-row";
      const label = document.createElement("span");
      label.textContent = `${name} (${customCategories[name].length} words)`;
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.addEventListener("click", () => {
        delete customCategories[name];
        const idx = settings.selectedCategories.indexOf(name);
        if (idx >= 0) settings.selectedCategories.splice(idx, 1);
        persistCustom();
        renderCustomList();
      });
      row.appendChild(label);
      row.appendChild(del);
      wrap.appendChild(row);
    });
  }

  document.getElementById("btn-save-custom").addEventListener("click", () => {
    const name = document.getElementById("custom-cat-name").value.trim();
    const words = document.getElementById("custom-cat-words").value
      .split("\n").map((w) => w.trim()).filter(Boolean);
    if (!name) { alert("Give the category a name."); return; }
    if (words.length < 6) { alert("Add at least 6 words, one per line."); return; }
    customCategories[name] = words;
    if (!settings.selectedCategories.includes(name)) settings.selectedCategories.push(name);
    persistCustom();
    document.getElementById("custom-cat-name").value = "";
    document.getElementById("custom-cat-words").value = "";
    renderCustomList();
  });

  // ---------------- Game state ----------------
  let game = null;
  let timerInterval = null;

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function shuffledIndices(n) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function startGame() {
    if (settings.selectedCategories.length === 0) {
      alert("Pick at least one category.");
      return;
    }
    clampImposters();
    persistSettings();
    persistCustom();

    const all = getAllCategories();
    const validCats = settings.selectedCategories.filter((c) => all[c] && all[c].length > 0);
    if (validCats.length === 0) { alert("Pick at least one category."); return; }
    const category = pick(validCats);
    const word = pick(all[category]);

    const players = Array.from({ length: settings.numPlayers }, (_, i) => ({
      id: i,
      name: (settings.playerNames[i] || "").trim() || `Player ${i + 1}`
    }));

    const shuffled = shuffledIndices(settings.numPlayers);
    const imposterSet = new Set(shuffled.slice(0, settings.numImposters));

    game = {
      players,
      category,
      word,
      imposterSet,
      revealIndex: 0,
      voteOrder: shuffledIndices(settings.numPlayers),
      voteIndex: 0,
      votes: {},
      timeLeft: settings.timerMinutes * 60,
      timerPaused: false
    };

    beginReveal();
  }
  document.getElementById("btn-start-game").addEventListener("click", startGame);

  // ---------------- Reveal phase ----------------
  function beginReveal() {
    game.revealIndex = 0;
    showPassScreen("reveal");
  }

  function showPassScreen(mode) {
    const eyebrow = document.getElementById("pass-eyebrow");
    const name = document.getElementById("pass-name");
    const sub = document.getElementById("pass-sub");
    const btn = document.getElementById("btn-reveal");

    if (mode === "reveal") {
      const p = game.players[game.revealIndex];
      eyebrow.textContent = "Pass the phone to";
      name.textContent = p.name;
      sub.textContent = "Only they should be looking at the screen.";
      btn.textContent = "Tap to Reveal";
      btn.onclick = () => { vibrate(15); showRole(); };
    } else {
      const p = game.players[game.voteOrder[game.voteIndex]];
      eyebrow.textContent = "Pass the phone to";
      name.textContent = p.name;
      sub.textContent = "Time to vote for the imposter.";
      btn.textContent = "Tap to Vote";
      btn.onclick = () => { vibrate(15); showVoteSelect(); };
    }
    showScreen("screen-pass");
  }

  function showRole() {
    const p = game.players[game.revealIndex];
    const isImposter = game.imposterSet.has(p.id);
    const catEl = document.getElementById("role-category");
    const wordEl = document.getElementById("role-word");

    if (isImposter) {
      wordEl.textContent = "YOU ARE THE IMPOSTER";
      wordEl.classList.add("is-imposter");
      catEl.textContent = settings.hintCategory ? `Category: ${game.category}` : "Blend in. Don't get caught.";
    } else {
      wordEl.textContent = game.word;
      wordEl.classList.remove("is-imposter");
      catEl.textContent = `Category: ${game.category}`;
    }
    showScreen("screen-role");
  }

  document.getElementById("btn-hide-role").addEventListener("click", () => {
    vibrate(10);
    game.revealIndex++;
    if (game.revealIndex < game.players.length) {
      showPassScreen("reveal");
    } else {
      beginDiscussion();
    }
  });

  // ---------------- Discussion / timer ----------------
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function beginDiscussion() {
    clearInterval(timerInterval);
    const display = document.getElementById("timer-display");
    const controls = document.getElementById("timer-controls");
    const pauseBtn = document.getElementById("btn-timer-pause");

    if (settings.timerMinutes === 0) {
      display.textContent = "No timer";
      controls.style.display = "none";
    } else {
      game.timeLeft = settings.timerMinutes * 60;
      display.textContent = formatTime(game.timeLeft);
      controls.style.display = "block";
      pauseBtn.textContent = "Pause";
      game.timerPaused = false;
      timerInterval = setInterval(() => {
        if (game.timerPaused) return;
        game.timeLeft--;
        if (game.timeLeft <= 0) {
          display.textContent = "0:00";
          clearInterval(timerInterval);
          vibrate([80, 60, 80]);
          return;
        }
        display.textContent = formatTime(game.timeLeft);
      }, 1000);
    }
    showScreen("screen-discuss");
  }

  document.getElementById("btn-timer-pause").addEventListener("click", (e) => {
    game.timerPaused = !game.timerPaused;
    e.target.textContent = game.timerPaused ? "Resume" : "Pause";
  });

  document.getElementById("btn-start-vote").addEventListener("click", () => {
    clearInterval(timerInterval);
    game.voteIndex = 0;
    game.votes = {};
    showPassScreen("vote");
  });

  // ---------------- Voting ----------------
  function showVoteSelect() {
    const voter = game.players[game.voteOrder[game.voteIndex]];
    document.getElementById("vote-eyebrow").textContent = `${voter.name}, who is the imposter?`;
    const grid = document.getElementById("vote-grid");
    grid.innerHTML = "";
    game.players.forEach((p) => {
      if (p.id === voter.id) return;
      const opt = document.createElement("button");
      opt.className = "vote-option";
      opt.textContent = p.name;
      opt.addEventListener("click", () => {
        vibrate(15);
        grid.querySelectorAll(".vote-option").forEach((o) => o.classList.remove("picked"));
        opt.classList.add("picked");
        game.votes[voter.id] = p.id;
        setTimeout(() => {
          game.voteIndex++;
          if (game.voteIndex < game.players.length) {
            showPassScreen("vote");
          } else {
            resolveVotes();
          }
        }, 350);
      });
      grid.appendChild(opt);
    });
    showScreen("screen-vote");
  }

  function resolveVotes() {
    const counts = {};
    game.players.forEach((p) => { counts[p.id] = 0; });
    Object.values(game.votes).forEach((targetId) => { counts[targetId] = (counts[targetId] || 0) + 1; });

    let maxCount = -1;
    Object.values(counts).forEach((c) => { if (c > maxCount) maxCount = c; });
    const topIds = Object.keys(counts).filter((id) => counts[id] === maxCount).map(Number);

    game.lastCounts = counts;

    if (maxCount === 0 || topIds.length !== 1) {
      finishRound(false, null);
      return;
    }
    const eliminatedId = topIds[0];
    const caughtImposter = game.imposterSet.has(eliminatedId);

    if (caughtImposter && settings.stealEnabled) {
      beginSteal(eliminatedId);
    } else {
      finishRound(caughtImposter, eliminatedId);
    }
  }

  // ---------------- Steal ----------------
  let stealPlayerId = null;
  function beginSteal(playerId) {
    stealPlayerId = playerId;
    const p = game.players.find((pl) => pl.id === playerId);
    document.getElementById("steal-sub").textContent =
      `${p.name} was caught! Pass them the phone — one guess at the secret word.`;
    document.getElementById("steal-input").value = "";
    document.getElementById("steal-answer").textContent = "";
    document.getElementById("steal-judge").style.display = "none";
    showScreen("screen-steal");
  }

  document.getElementById("btn-steal-reveal").addEventListener("click", () => {
    document.getElementById("steal-answer").textContent = `The word was: ${game.word}`;
    document.getElementById("steal-judge").style.display = "flex";
  });
  document.getElementById("btn-steal-correct").addEventListener("click", () => {
    finishRound(false, stealPlayerId, true);
  });
  document.getElementById("btn-steal-wrong").addEventListener("click", () => {
    finishRound(true, stealPlayerId, true);
  });

  // ---------------- Results ----------------
  function finishRound(crewWins, eliminatedId, wasSteal) {
    if (crewWins) scoreboard.crew++; else scoreboard.imposter++;
    persistScore();
    renderScoreboard();

    document.getElementById("results-headline").textContent = crewWins ? "Crew Wins!" : "Imposters Win!";

    const tallyList = document.getElementById("tally-list");
    tallyList.innerHTML = "";
    const counts = game.lastCounts || {};
    game.players.slice().sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)).forEach((p) => {
      const row = document.createElement("div");
      row.className = "tally-row" + (game.imposterSet.has(p.id) ? " is-imposter" : "");
      row.innerHTML = `<span class="tally-name">${p.name}${game.imposterSet.has(p.id) ? " 🕵️" : ""}</span><span class="tally-count">${counts[p.id] || 0} vote${(counts[p.id] || 0) === 1 ? "" : "s"}</span>`;
      tallyList.appendChild(row);
    });

    const impNames = game.players.filter((p) => game.imposterSet.has(p.id)).map((p) => p.name).join(", ");
    let msg = `The word was <b>${game.word}</b> (${game.category}).<br>The imposter${game.imposterSet.size > 1 ? "s were" : " was"} <b>${impNames}</b>.`;
    if (eliminatedId === null) msg += "<br>The vote was tied — no one was eliminated.";
    if (wasSteal) msg += crewWins ? "<br>The steal guess was wrong." : "<br>The steal guess was correct!";
    document.getElementById("reveal-box").innerHTML = msg;

    showScreen("screen-results");
  }

  document.getElementById("btn-play-again").addEventListener("click", startGame);
  document.getElementById("btn-new-setup").addEventListener("click", () => {
    initSetupScreen();
    showScreen("screen-setup");
  });

  // ---------------- PWA install ----------------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => { /* offline support best-effort */ });
    });
  }
})();
