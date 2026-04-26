(function(){
    // --------------------- LABYRINTHE DYNAMIQUE (15x15) --------------------
    // 0 = mur, 1 = chemin, 2 = départ (joueur), 3 = sortie
    const rawMaze = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,1,1,1,1,1,1,1,0,1,0],
        [0,1,0,1,0,1,0,0,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,3,0,1,0,1,0,1,0],   // 3: sortie
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1,1,1,1,1,0,1,1,1,1,1,0,1,0],
        [0,0,0,1,0,0,0,1,0,0,0,1,0,1,0],
        [0,1,1,1,0,1,0,1,0,1,1,1,1,1,0],
        [0,1,0,1,0,1,0,1,0,1,0,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,1,1,1,0],
        [0,1,0,0,0,1,0,1,0,0,0,1,0,1,0],
        [0,1,1,1,0,1,1,1,0,1,1,1,0,1,0],
        [0,0,0,1,0,0,0,1,0,1,0,0,0,1,0],
        [0,2,1,1,1,1,1,1,1,1,1,1,1,1,0],   // 2: départ
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    const CELL_SIZE = 650 / 15;
    const MAZE_SIZE = 15;
    let maze = [];
    let playerPos = { row: 13, col: 1 };
    let exitPos = { row: 3, col: 7 };
    let gameActive = true;
    let victoryFlag = false;
    
    let currentScore = 0;
    let startTime = null;
    let timerInterval = null;
    let bestTime = localStorage.getItem("labyBestTime") ? parseFloat(localStorage.getItem("labyBestTime")) : Infinity;
    
    const canvas = document.getElementById("labyrinthCanvas");
    const ctx = canvas.getContext("2d");
    const scoreSpan = document.getElementById("scoreDisplay");
    const timerSpan = document.getElementById("timerDisplay");
    const bestSpan = document.getElementById("bestTimeDisplay");
    const victoryDiv = document.getElementById("victoryMessageArea");
    const resetBtn = document.getElementById("resetGameBtn");
    
    function cloneMaze() {
        return rawMaze.map(row => [...row]);
    }
    
    function updateBestDisplay() {
        if (bestTime === Infinity) {
            bestSpan.innerText = "✨ --";
        } else {
            bestSpan.innerText = bestTime.toFixed(2) + " s";
        }
    }
    
    function saveBestTimeIfNeeded(seconds) {
        if (seconds < bestTime) {
            bestTime = seconds;
            localStorage.setItem("labyBestTime", bestTime);
            updateBestDisplay();
            return true;
        }
        return false;
    }
    
    function updateScoreUI() {
        scoreSpan.innerText = Math.floor(currentScore);
    }
    
    function updateTimer() {
        if(!gameActive || victoryFlag) return;
        if(!startTime) return;
        const elapsed = (Date.now() - startTime) / 1000;
        if(elapsed >= 0) {
            timerSpan.innerText = elapsed.toFixed(2);
            let rawScore = Math.floor(Math.max(0, 1200 - elapsed * 8));
            currentScore = rawScore;
            updateScoreUI();
        }
    }
    
    function victory() {
        if(victoryFlag) return;
        if(!gameActive) return;
        victoryFlag = true;
        gameActive = false;
        if(timerInterval) clearInterval(timerInterval);
        const finalTime = (Date.now() - startTime) / 1000;
        timerSpan.innerText = finalTime.toFixed(2);
        let finalScore = Math.floor(Math.max(0, 1200 - finalTime * 8));
        currentScore = finalScore;
        updateScoreUI();
        
        const isNewRecord = saveBestTimeIfNeeded(finalTime);
        let recordMsg = isNewRecord ? "🏆 NOUVEAU RECORD ! 🏆" : "";
        victoryDiv.innerHTML = `<div class="victory-message">✨ VICTOIRE ! ✨ Temps: ${finalTime.toFixed(2)} sec | Score: ${currentScore} pts ${recordMsg}</div>`;
        
        drawMaze();
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#FFD966";
        ctx.fillRect(0,0,650,650);
        ctx.restore();
        setTimeout(()=>drawMaze(), 150);
    }
    
    function tryMove(dRow, dCol) {
        if(!gameActive || victoryFlag) return false;
        const newRow = playerPos.row + dRow;
        const newCol = playerPos.col + dCol;
        if(newRow < 0 || newRow >= MAZE_SIZE || newCol < 0 || newCol >= MAZE_SIZE) return false;
        const targetCell = maze[newRow][newCol];
        if(targetCell === 0) return false;
        if(targetCell === 3) {
            victory();
            return true;
        }
        if(targetCell === 1 || targetCell === 2) {
            if(maze[playerPos.row][playerPos.col] === 2) {
                maze[playerPos.row][playerPos.col] = 1;
            }
            playerPos = { row: newRow, col: newCol };
            if(maze[newRow][newCol] !== 3) {
                maze[newRow][newCol] = 2;
            }
            drawMaze();
            return true;
        }
        return false;
    }
    
    function drawMaze() {
        if(!ctx) return;
        ctx.clearRect(0, 0, 650, 650);
        for(let row = 0; row < MAZE_SIZE; row++) {
            for(let col = 0; col < MAZE_SIZE; col++) {
                let x = col * CELL_SIZE;
                let y = row * CELL_SIZE;
                let cellType = maze[row][col];
                
                if(cellType === 0) {
                    ctx.fillStyle = "#2C2E3E";
                    ctx.fillRect(x, y, CELL_SIZE-0.5, CELL_SIZE-0.5);
                    ctx.fillStyle = "#1E1F2C";
                    ctx.fillRect(x+2, y+2, CELL_SIZE-4, CELL_SIZE-4);
                    ctx.fillStyle = "#4A3E35";
                    ctx.fillRect(x+1, y+1, CELL_SIZE-2, CELL_SIZE-2);
                    ctx.strokeStyle = "#6a5a4a";
                    ctx.lineWidth = 0.6;
                    ctx.strokeRect(x+3, y+3, CELL_SIZE-7, CELL_SIZE-7);
                } 
                else if(cellType === 1) {
                    let gradient = ctx.createLinearGradient(x, y, x+CELL_SIZE, y+CELL_SIZE);
                    gradient.addColorStop(0, "#CFD8C5");
                    gradient.addColorStop(1, "#B9C6A8");
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, y, CELL_SIZE-0.3, CELL_SIZE-0.3);
                    ctx.fillStyle = "#A3B18A";
                    ctx.fillRect(x+1, y+1, CELL_SIZE-2.5, CELL_SIZE-2.5);
                    ctx.fillStyle = "#E6EED3";
                    ctx.fillRect(x+2, y+2, CELL_SIZE-5, CELL_SIZE-5);
                }
                else if(cellType === 2) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "#ffbc6e";
                    ctx.fillStyle = "#F5B042";
                    ctx.beginPath();
                    ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, CELL_SIZE*0.3, 0, Math.PI*2);
                    ctx.fill();
                    ctx.fillStyle = "#E58C2A";
                    ctx.beginPath();
                    ctx.arc(x + CELL_SIZE/2 - 2, y + CELL_SIZE/2 - 2, CELL_SIZE*0.08, 0, Math.PI*2);
                    ctx.fill();
                    ctx.fillStyle = "#FFFFFF";
                    ctx.beginPath();
                    ctx.arc(x + CELL_SIZE/2 - 3, y + CELL_SIZE/2 - 3, CELL_SIZE*0.04, 0, Math.PI*2);
                    ctx.fill();
                    ctx.fillStyle = "#5A3A1A";
                    ctx.beginPath();
                    ctx.ellipse(x + CELL_SIZE/2 + 3, y + CELL_SIZE/2 + 2, 3, 2, 0, 0, Math.PI*2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#C94F4F";
                    ctx.beginPath();
                    ctx.moveTo(x + CELL_SIZE*0.65, y + CELL_SIZE*0.7);
                    ctx.lineTo(x + CELL_SIZE*0.85, y + CELL_SIZE*0.95);
                    ctx.lineTo(x + CELL_SIZE*0.5, y + CELL_SIZE*0.95);
                    ctx.fill();
                }
                else if(cellType === 3) {
                    ctx.fillStyle = "#ABE2C6";
                    ctx.fillRect(x, y, CELL_SIZE-0.5, CELL_SIZE-0.5);
                    ctx.fillStyle = "#F9E79F";
                    ctx.beginPath();
                    ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, CELL_SIZE*0.28, 0, Math.PI*2);
                    ctx.fill();
                    ctx.fillStyle = "#F7DC6F";
                    ctx.beginPath();
                    ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, CELL_SIZE*0.17, 0, Math.PI*2);
                    ctx.fill();
                    ctx.fillStyle = "#FFD700";
                    for(let i=0; i<6; i++) {
                        let angle = Date.now() / 400 + i;
                        let rad = CELL_SIZE*0.22;
                        let starX = x + CELL_SIZE/2 + Math.cos(angle)*rad;
                        let starY = y + CELL_SIZE/2 + Math.sin(angle)*rad;
                        ctx.beginPath();
                        ctx.arc(starX, starY, 2.5, 0, Math.PI*2);
                        ctx.fill();
                    }
                    ctx.fillStyle = "#A569BD";
                    ctx.font = `bold ${CELL_SIZE*0.35}px monospace`;
                    ctx.shadowBlur = 4;
                    ctx.fillText("⭐", x+CELL_SIZE*0.33, y+CELL_SIZE*0.75);
                    ctx.shadowBlur = 0;
                }
            }
        }
        ctx.beginPath();
        ctx.strokeStyle = "#CBB98550";
        ctx.lineWidth = 0.8;
        for(let i=0; i<=MAZE_SIZE; i++) {
            ctx.moveTo(i*CELL_SIZE, 0);
            ctx.lineTo(i*CELL_SIZE, 650);
            ctx.moveTo(0, i*CELL_SIZE);
            ctx.lineTo(650, i*CELL_SIZE);
            ctx.stroke();
        }
    }
    
    function handleKeyDown(e) {
        const key = e.key;
        if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
            e.preventDefault();
        }
        if(!gameActive || victoryFlag) return;
        switch(key) {
            case "ArrowUp": tryMove(-1, 0); break;
            case "ArrowDown": tryMove(1, 0); break;
            case "ArrowLeft": tryMove(0, -1); break;
            case "ArrowRight": tryMove(0, 1); break;
            default: break;
        }
    }
    
    function initGame(resetTimerAndScore = true) {
        maze = cloneMaze();
        for(let i=0; i<MAZE_SIZE; i++) {
            for(let j=0; j<MAZE_SIZE; j++) {
                if(maze[i][j] === 2) {
                    playerPos = { row: i, col: j };
                }
                if(maze[i][j] === 3) {
                    exitPos = { row: i, col: j };
                }
            }
        }
        gameActive = true;
        victoryFlag = false;
        victoryDiv.innerHTML = "";
        
        if(resetTimerAndScore) {
            currentScore = 0;
            updateScoreUI();
            if(timerInterval) clearInterval(timerInterval);
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 100);
            updateTimer();
        } else {
            if(timerInterval) clearInterval(timerInterval);
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 100);
            updateTimer();
        }
        drawMaze();
    }
    
    function resetFullGame() {
        if(timerInterval) clearInterval(timerInterval);
        initGame(true);
        victoryFlag = false;
        gameActive = true;
        victoryDiv.innerHTML = "";
        drawMaze();
    }
    
    window.addEventListener("load", () => {
        initGame(true);
        updateBestDisplay();
        drawMaze();
        window.addEventListener("keydown", handleKeyDown);
        resetBtn.addEventListener("click", () => {
            resetFullGame();
        });
        canvas.addEventListener("touchstart", (e) => e.preventDefault());
    });
    
    setInterval(() => {
        if(!victoryFlag && gameActive && canvas) {
            drawMaze();
        }
    }, 150);
})();