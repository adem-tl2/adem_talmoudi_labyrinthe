(function () {

    // ===================== GAME STATE =====================
    const STATE = {
        PLAYING: "playing",
        WIN: "win",
        GAMEOVER: "gameover"
    };

    let state = STATE.PLAYING;

    // ===================== LEVELS =====================
    const levels = [
        {
            map: [
                [0,0,0,0,0,0,0],
                [0,2,1,1,1,3,0],
                [0,1,0,1,0,1,0],
                [0,1,1,1,1,1,0],
                [0,0,0,0,0,0,0]
            ],
            time: 60
        },
        {
            map: [
                [0,0,0,0,0,0,0,0,0],
                [0,2,1,1,0,1,3,1,0],
                [0,1,0,1,0,1,0,1,0],
                [0,1,4,1,1,1,4,1,0],
                [0,1,0,0,0,1,0,1,0],
                [0,1,1,1,1,1,1,1,0],
                [0,0,0,0,0,0,0,0,0]
            ],
            time: 50
        }
    ];

    let levelIndex = 0;
    let maze = levels[levelIndex].map;

    // ===================== PLAYER =====================
    let player = { r: 0, c: 0 };
    let lives = 3;
    let score = 0;

    // ===================== TIMER =====================
    let startTime = Date.now();
    let timeLeft = levels[levelIndex].time;
    let timerInterval;

    // ===================== CANVAS =====================
    const canvas = document.getElementById("labyrinthCanvas");
    const ctx = canvas.getContext("2d");
    const CELL = 80;

    // ===================== UI =====================
    const scoreEl = document.getElementById("scoreDisplay");
    const timerEl = document.getElementById("timerDisplay");
    const bestEl = document.getElementById("bestTimeDisplay");

    let best = localStorage.getItem("bestScore") || 0;
    bestEl.textContent = best;

    // ===================== INIT =====================
    function initLevel() {
        maze = levels[levelIndex].map;
        player = findStart();

        state = STATE.PLAYING;

        timeLeft = levels[levelIndex].time;

        startTimer();
        draw();
    }

    function findStart() {
        for (let r = 0; r < maze.length; r++) {
            for (let c = 0; c < maze[r].length; c++) {
                if (maze[r][c] === 2) return { r, c };
            }
        }
        return { r: 0, c: 0 };
    }

    // ===================== TIMER =====================
    function startTimer() {
        clearInterval(timerInterval);

        startTime = Date.now();

        timerInterval = setInterval(() => {
            if (state !== STATE.PLAYING) return;

            let elapsed = Math.floor((Date.now() - startTime) / 1000);
            timeLeft = levels[levelIndex].time - elapsed;

            timerEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                gameOver();
            }
        }, 1000);
    }

    // ===================== MOVE =====================
    function move(dr, dc) {
        if (state !== STATE.PLAYING) return;

        let nr = player.r + dr;
        let nc = player.c + dc;

        let cell = maze[nr][nc];

        if (cell === 0) return;

        // TRAP
        if (cell === 4) {
            lives--;
            flashTrap();

            if (lives <= 0) {
                gameOver();
                return;
            }
        }

        player.r = nr;
        player.c = nc;

        // WIN
        if (cell === 3) {
            win();
        }

        draw();
    }

    // ===================== WIN =====================
    function win() {
        state = STATE.WIN;

        clearInterval(timerInterval);

        score += timeLeft * 10;

        if (score > best) {
            best = score;
            localStorage.setItem("bestScore", best);
        }

        bestEl.textContent = best;

        setTimeout(nextLevel, 800);
    }

    // ===================== GAME OVER =====================
    function gameOver() {
        state = STATE.GAMEOVER;

        clearInterval(timerInterval);

        alert("💀 Game Over");

        resetGame();
    }

    // ===================== NEXT LEVEL =====================
    function nextLevel() {
        levelIndex++;

        if (levelIndex >= levels.length) {
            alert("🏁 FIN DU JEU !");
            levelIndex = 0;
        }

        initLevel();
    }

    // ===================== RESET GAME (IMPORTANT) =====================
    function resetGame() {
        levelIndex = 0;
        score = 0;
        lives = 3;

        clearInterval(timerInterval);

        initLevel();
    }

    // ===================== DRAW =====================
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < maze.length; r++) {
            for (let c = 0; c < maze[r].length; c++) {

                let x = c * CELL;
                let y = r * CELL;

                switch (maze[r][c]) {
                    case 0: ctx.fillStyle = "#111"; break;
                    case 1: ctx.fillStyle = "#ddd"; break;
                    case 2: ctx.fillStyle = "orange"; break;
                    case 3: ctx.fillStyle = "green"; break;
                    case 4: ctx.fillStyle = "red"; break;
                }

                ctx.fillRect(x, y, CELL, CELL);
            }
        }

        // PLAYER
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(
            player.c * CELL + CELL / 2,
            player.r * CELL + CELL / 2,
            CELL / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // ===================== TRAP EFFECT =====================
    function flashTrap() {
        canvas.style.filter = "hue-rotate(180deg)";
        setTimeout(() => {
            canvas.style.filter = "none";
        }, 200);
    }

    // ===================== INPUT =====================
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") move(-1, 0);
        if (e.key === "ArrowDown") move(1, 0);
        if (e.key === "ArrowLeft") move(0, -1);
        if (e.key === "ArrowRight") move(0, 1);
    });

    // ===================== BUTTON RESET (FIX IMPORTANT) =====================
    document.getElementById("resetGameBtn").addEventListener("click", () => {
        resetGame();
    });

    // ===================== START =====================
    window.onload = initLevel;

})();