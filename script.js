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
});