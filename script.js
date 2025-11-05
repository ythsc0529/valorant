//為方便理解程式內容，部分註解由AI生成
// 等待 DOM 內容載入完成
document.addEventListener('DOMContentLoaded', () => {

    // --- 資料庫 ---
    const agents = [
        "亞星卓", "布史東", "哈泊", "婕提", "珂樂芙", "愷宙", "KAY/O", "錢博爾", "夜戮", "妮虹", 
        "歐門", "菲尼克斯", "芮茲", "絲凱", "蘇法", "聖祈", "瑟符", "維蕾", "維托", "薇蝮", 
        "薇絲", "離索", "判奇", "菲德", "蒂羅", "蓋克", "蕾娜"
    ];
    
    const weapons = [
        "刀", "制式手槍", "短管", "鬼魅", "神射", "刺針", "惡靈", "重砲", "判官", 
        "鬥牛犬", "捍衛者", "暴徒", "幻象", "警長", "逃犯", "間諜", "戰神", "奧丁"
    ];
    
    const events = [
        "整局只能跳走", "只能倒退走", "所有人只能拿 (隨機一個武器)", "不能靜走 (Shift)", 
        "禁止換彈 (打到沒子彈為止)", "禁止安裝/拆除 Spike", "只能蹲走", "只能走射 (不能靜止)"
    ];
    
    const maps = [
        "晶蝕之地", "深窟幽境", "日落之城", "蓮華古城", "深海遺珠", "天漠之峽", 
        "熱帶樂園 (Breeze)", "極地寒港", "意境空島", "雙塔迷城", "遺落境地", "劫境之地"
    ];

    // --- 隨機函式 ---
    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // --- 頁面導覽 (SPA 邏輯) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // 取得 # 後的 ID

            // 隱藏所有頁面
            pageSections.forEach(section => {
                section.classList.remove('active');
            });

            // 移除所有連結的 active 狀態
            navLinks.forEach(nav => {
                nav.classList.remove('active');
            });

            // 顯示目標頁面
            document.getElementById(targetId).classList.add('active');
            // 標註
            link.classList.add('active');
        });
    });
    // 預設啟動第一個連結
    navLinks[0].classList.add('active');
    pageSections[0].classList.add('active');


    // --- 更新日誌 Modal 邏輯 ---
    const modal = document.getElementById('update-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const confirmModalBtn = document.getElementById('modal-confirm-btn');

    // 顯示 Modal (您可以加入 cookie/localStorage 判斷是否顯示)
    // 為了演示，這裡預設顯示
    // modal.classList.add('show'); 
    // ^ 已改用 HTML/CSS 預設顯示

    function closeModal() {
        modal.classList.remove('show');
    }

    closeModalBtn.addEventListener('click', closeModal);
    confirmModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        // 點擊背景關閉
        if (e.target === modal) {
            closeModal();
        }
    });


    // --- 娛樂區邏輯 ---
    const agentBtn = document.getElementById('random-agent-btn');
    const agentResult = document.getElementById('agent-result');
    const weaponBtn = document.getElementById('random-weapon-btn');
    const weaponResult = document.getElementById('weapon-result');
    const eventBtn = document.getElementById('random-event-btn');
    const eventResult = document.getElementById('event-result');
    const mapBtn = document.getElementById('random-map-btn');
    const mapResult = document.getElementById('map-result');

    agentBtn.addEventListener('click', () => {
        agentResult.textContent = getRandomElement(agents);
    });

    weaponBtn.addEventListener('click', () => {
        weaponResult.textContent = getRandomElement(weapons);
    });

    eventBtn.addEventListener('click', () => {
        let randomEvent = getRandomElement(events);
        // 特殊處理：如果事件包含 "隨機一個武器"，則動態替換
        if (randomEvent.includes("(隨機一個武器)")) {
            const randomWeapon = getRandomElement(weapons.filter(w => w !== '刀')); // 排除刀
            randomEvent = `所有人只能拿 ${randomWeapon}`;
        }
        eventResult.textContent = randomEvent;
    });

    mapBtn.addEventListener('click', () => {
        mapResult.textContent = getRandomElement(maps);
    });


    // --- 電腦分隊邏輯 ---
    const splitBtn = document.getElementById('split-teams-btn');
    const playerNamesInput = document.getElementById('player-names');
    const teamA_UI = document.getElementById('team-a');
    const teamB_UI = document.getElementById('team-b');
    const splitterError = document.getElementById('splitter-error');

    splitBtn.addEventListener('click', () => {
        // 重置
        teamA_UI.innerHTML = '';
        teamB_UI.innerHTML = '';
        splitterError.textContent = '';

        // 1. 獲取並清理玩家名稱
        const playerNames = playerNamesInput.value
            .split('\n') // 用換行符號分割
            .map(name => name.trim()) // 去除前後空白
            .filter(name => name.length > 0); // 過濾掉空行

        // 2. 驗證人數
        if (playerNames.length < 2 || playerNames.length > 10) {
            splitterError.textContent = '人數必須介於 2 到 10 人之間。';
            return;
        }

        // 3. 洗牌 (Fisher-Yates Shuffle)
        let shuffledNames = [...playerNames];
        for (let i = shuffledNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
        }

        // 4. 分隊
        const midIndex = Math.ceil(shuffledNames.length / 2);
        const teamA = shuffledNames.slice(0, midIndex);
        const teamB = shuffledNames.slice(midIndex);

        // 5. 顯示結果
        teamA.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player;
            teamA_UI.appendChild(li);
        });

        teamB.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player;
            teamB_UI.appendChild(li);
        });
    });


    // --- esports 分頁切換 ---
    const esportsTabBtns = document.querySelectorAll('.esports-tabs .tab-btn');
    const esportsPanels = document.querySelectorAll('.esports-panel');

    if (esportsTabBtns.length) {
        esportsTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 切換按鈕樣式
                esportsTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 顯示對應 panel
                const target = btn.getAttribute('data-tab');
                esportsPanels.forEach(p => {
                    if (p.id === target) {
                        p.classList.add('active');
                        p.setAttribute('aria-hidden', 'false');
                    } else {
                        p.classList.remove('active');
                        p.setAttribute('aria-hidden', 'true');
                    }
                });

                // 確保視圖滾動到 esports 區塊（在 SPA 模式下）
                const esportsSection = document.getElementById('esports');
                if (esportsSection) {
                    esportsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }


    // 小遊戲清單與互動
    const miniGames = [
        {
            id: 'reaction-rush',
            title: '反應測試：Reaction Rush',
            desc: '測量你的反應速度。等待畫面變綠後，盡快點擊方塊。會顯示反應時間（ms）。',
            playable: true
        },
        {
            id: 'aim-trainer',
            title: 'AIM 訓練：Aim Lab Lite',
            desc: '30 秒內點擊盡可能多的靶心，測試精準與速度，結束後會顯示命中、每秒命中數與與一般人 / 職業選手比較。',
            playable: true
        },
        {
            id: 'spike-defuse',
            title: '爆彈拆解模擬：Spike Defuse Rush',
            desc: '模擬拆除 Spike 的快節奏挑戰。限時判定分數，強調協作與時機（暫為說明/未實作）。',
            playable: false
        },
        {
            id: 'agent-matchup',
            title: '特務配對小考：Agent Matchup Quiz',
            desc: '題目以特務技能互動、克制關係為主，測驗戰術理解力（暫為說明/未實作）。',
            playable: false
        },
        {
            id: 'map-callout',
            title: '地圖標記競賽：Map Callout Race',
            desc: '在指定地圖上快速標註正確點位，測試地圖意識與溝通（暫為說明/未實作）。',
            playable: false
        }
    ];

    const minigamesGrid = document.getElementById('minigames-grid');
    const gameModal = document.getElementById('game-modal');
    const gameModalBody = document.getElementById('game-modal-body');
    const gameModalClose = document.getElementById('game-modal-close');

    function renderMiniGames() {
        minigamesGrid.innerHTML = '';
        miniGames.forEach(g => {
            const card = document.createElement('div');
            card.className = 'game-card glass';
            card.innerHTML = `
                <h4>${g.title}</h4>
                <p>${g.desc}</p>
                <div class="game-actions">
                    <button class="reaction-btn" data-game="${g.id}">${g.playable ? '開始遊戲' : '查看說明'}</button>
                </div>
            `;
            minigamesGrid.appendChild(card);
        });
    }

    function openGameModal(gameId) {
        const game = miniGames.find(x => x.id === gameId);
        if (!game) return;
        gameModalBody.innerHTML = ''; // 清空
        if (gameId === 'reaction-rush') {
            // 注入可玩的反應測試 UI
            gameModalBody.innerHTML = `
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
                <div class="reaction-game">
                    <div id="reaction-box" class="reaction-box ready">點擊「開始」準備</div>
                    <div>
                        <button id="reaction-start" class="reaction-btn">開始</button>
                        <button id="reaction-reset" class="reaction-btn" style="background:#888;margin-left:8px;">重置</button>
                    </div>
                    <div class="reaction-result" id="reaction-result">尚未測試</div>
                </div>
            `;
            // 綁定反應測試邏輯
            initReactionGame();
        } else if (gameId === 'aim-trainer') {
            // 注入 AIM 訓練 UI
            gameModalBody.innerHTML = `
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
                <div class="aim-game">
                    <div class="aim-controls" style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                        <button id="aim-start" class="reaction-btn">開始 (30s)</button>
                        <button id="aim-stop" class="reaction-btn" style="background:#888;">停止</button>
                        <div id="aim-timer" style="margin-left:8px;color:rgba(255,255,255,0.9);font-weight:700;">時間：30s</div>
                    </div>
                    <div id="aim-area" class="aim-area"></div>
                    <div class="aim-stats" style="margin-top:12px;">
                        <div>命中：<span id="aim-hits">0</span></div>
                        <div>未命中：<span id="aim-misses">0</span></div>
                        <div>每秒命中 (HPS)：<span id="aim-hps">0.00</span></div>
                        <div id="aim-comparison" style="margin-top:6px;color:rgba(255,255,255,0.9);font-weight:700;"></div>
                    </div>
                </div>
            `;
            initAimTrainer();
        } else {
            // 顯示說明文本（暫未實作）
            gameModalBody.innerHTML = `
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
                <p style="color:rgba(255,255,255,0.8);">此遊戲尚在開發中，後續會補上可玩的版本與排行榜功能。</p>
            `;
        }
        gameModal.setAttribute('aria-hidden', 'false');
    }

    // 修改 closeGameModal: 呼叫可能的 cleanup（由各遊戲設定）
    function closeGameModal() {
        // 若有遊戲專屬清理函式，呼叫它
        if (gameModal._cleanup && typeof gameModal._cleanup === 'function') {
            try { gameModal._cleanup(); } catch (err) { /* ignore */ }
            delete gameModal._cleanup;
        }
        gameModal.setAttribute('aria-hidden', 'true');
        gameModalBody.innerHTML = '';
    }

    /* 反應測試實作 */
    function initReactionGame() {
        const box = document.getElementById('reaction-box');
        const startBtn = document.getElementById('reaction-start');
        const resetBtn = document.getElementById('reaction-reset');
        const resultEl = document.getElementById('reaction-result');

        let timeoutId = null;
        let startTime = 0;
        let state = 'idle'; // idle, waiting, go

        function setBoxState(cls, text) {
            box.className = 'reaction-box ' + cls;
            box.textContent = text;
        }

        function startSequence() {
            if (state === 'waiting') return;
            setBoxState('wait', '請等待……');
            state = 'waiting';
            resultEl.textContent = '等待中…';
            const delay = 800 + Math.random() * 2000; // 0.8s ~ 2.8s
            timeoutId = setTimeout(() => {
                setBoxState('go', '現在！點擊我！');
                startTime = performance.now();
                state = 'go';
            }, delay);
        }

        function resetSequence() {
            clearTimeout(timeoutId);
            timeoutId = null;
            state = 'idle';
            setBoxState('ready', '點擊「開始」準備');
            resultEl.textContent = '尚未測試';
        }

        function handleClick() {
            if (state === 'go') {
                const reaction = Math.round(performance.now() - startTime);
                // 比較基準（ms）
                const avg = 250; // 一般人中位反應時間
                const pro = 150; // 職業選手中位反應時間
                const diffAvg = avg - reaction;
                const diffPro = reaction - pro;
                const cmpAvg = reaction <= avg ? `比一般人快 ${Math.abs(diffAvg)} ms` : `比一般人慢 ${Math.abs(diffAvg)} ms`;
                const cmpPro = reaction <= pro ? `比職業選手快 ${Math.abs(diffPro)} ms` : `比職業選手慢 ${Math.abs(diffPro)} ms`;
                // 建立結果字串
                resultEl.innerHTML = `你的反應： <strong>${reaction} ms</strong><br><span style="color:rgba(255,255,255,0.9);">${cmpAvg} — ${cmpPro}</span>`;
                setBoxState('ready', `完成：${reaction} ms`);
                state = 'idle';
                clearTimeout(timeoutId);
                timeoutId = null;
            } else if (state === 'waiting') {
                // 太早點擊
                clearTimeout(timeoutId);
                timeoutId = null;
                state = 'idle';
                resultEl.textContent = '太早了！請重試。';
                setBoxState('ready', '太早點擊 - 重置');
            } else {
                // idle：點擊箱子無效，提示點開始
                resultEl.textContent = '請按「開始」開始測試。';
            }
        }

        box.addEventListener('click', handleClick);
        startBtn.addEventListener('click', startSequence);
        resetBtn.addEventListener('click', resetSequence);
        // 初始化顯示
        resetSequence();
    }

    /* Aim Trainer 實作（簡易版） */
    function initAimTrainer() {
        const area = document.getElementById('aim-area');
        const startBtn = document.getElementById('aim-start');
        const stopBtn = document.getElementById('aim-stop');
        const timerEl = document.getElementById('aim-timer');
        const hitsEl = document.getElementById('aim-hits');
        const missesEl = document.getElementById('aim-misses');
        const hpsEl = document.getElementById('aim-hps');
        const cmpEl = document.getElementById('aim-comparison');

        // 變數
        let hits = 0;
        let misses = 0;
        let running = false;
        let timeLeft = 30;
        let intervalId = null;
        let targetEl = null;

        // 參考標準 (HPS)
        const avgHPS = 1.5; // 一般人每秒命中平均值（示意）
        const proHPS = 3.0; // 職業選手每秒命中平均值（示意）

        // 建立目標
        function spawnTarget() {
            removeTarget();
            const rect = area.getBoundingClientRect();
            const size = 42;
            const x = Math.random() * Math.max(0, rect.width - size);
            const y = Math.random() * Math.max(0, rect.height - size);
            const t = document.createElement('div');
            t.className = 'target';
            t.style.width = size + 'px';
            t.style.height = size + 'px';
            t.style.left = x + 'px';
            t.style.top = y + 'px';
            t.style.position = 'absolute';
            t.style.borderRadius = '50%';
            t.style.background = 'var(--primary-color)';
            t.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
            t.style.cursor = 'pointer';
            t.dataset.spawned = Date.now();
            t.addEventListener('click', onTargetClick);
            area.appendChild(t);
            targetEl = t;
        }

        function removeTarget() {
            if (targetEl && targetEl.parentNode) {
                targetEl.removeEventListener('click', onTargetClick);
                targetEl.parentNode.removeChild(targetEl);
                targetEl = null;
            }
        }

        function onTargetClick(e) {
            e.stopPropagation();
            if (!running) return;
            hits++;
            hitsEl.textContent = hits;
            spawnTarget();
        }

        function onAreaClick(e) {
            // 點擊到空白視為未命中
            if (!running) return;
            if (e.target === area) {
                misses++;
                missesEl.textContent = misses;
            }
        }

        function startGame() {
            if (running) return;
            // reset
            hits = 0; misses = 0; timeLeft = 30;
            hitsEl.textContent = '0';
            missesEl.textContent = '0';
            hpsEl.textContent = '0.00';
            cmpEl.textContent = '';
            running = true;
            timerEl.textContent = `時間：${timeLeft}s`;
            spawnTarget();
            intervalId = setInterval(() => {
                timeLeft--;
                timerEl.textContent = `時間：${timeLeft}s`;
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
        }

        function endGame() {
            running = false;
            clearInterval(intervalId);
            intervalId = null;
            removeTarget();
            const duration = 30;
            const hps = hits / duration;
            hpsEl.textContent = hps.toFixed(2);
            // 比較文字
            const diffAvg = hps - avgHPS;
            const diffPro = hps - proHPS;
            const cmpAvg = diffAvg >= 0 ? `高於一般人 ${diffAvg.toFixed(2)} HPS` : `低於一般人 ${Math.abs(diffAvg).toFixed(2)} HPS`;
            const cmpPro = diffPro >= 0 ? `高於職業選手 ${diffPro.toFixed(2)} HPS` : `低於職業選手 ${Math.abs(diffPro).toFixed(2)} HPS`;
            cmpEl.textContent = `比較：${cmpAvg} — ${cmpPro}`;
        }

        function stopGame() {
            if (!running) return;
            running = false;
            clearInterval(intervalId);
            intervalId = null;
            removeTarget();
        }

        // Cleanup function - 儲存到 modal 以便關閉時呼叫
        function cleanup() {
            stopGame();
            area.removeEventListener('click', onAreaClick);
        }
        gameModal._cleanup = cleanup;

        // 綁定事件
        area.addEventListener('click', onAreaClick);
        startBtn.addEventListener('click', startGame);
        stopBtn.addEventListener('click', stopGame);

        // 初始化顯示：建立空白 area 高度
        area.style.minHeight = '320px';
        area.style.position = 'relative';
        area.innerHTML = ''; // clear
        hitsEl.textContent = '0';
        missesEl.textContent = '0';
        hpsEl.textContent = '0.00';
        cmpEl.textContent = '';
    }

    // 事件委派：點擊按鈕開啟 Modal
    minigamesGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-game]');
        if (!btn) return;
        const gameId = btn.getAttribute('data-game');
        openGameModal(gameId);
    });

    gameModalClose.addEventListener('click', closeGameModal);
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) closeGameModal();
    });

    // 初始化渲染
    renderMiniGames();
});