let board = document.querySelector('.board');
let dartboard = document.querySelector('.dartboard');
let arrow = document.querySelector('.cursor');
let roundinfo = document.querySelector('.info-round');
let arrowfly = document.querySelectorAll('.flying-dart');
let scoreinfo = document.querySelectorAll('.info-score');
let countinfo = document.querySelector('.info-counter');
let avginfo = document.querySelectorAll('.info-average');
let darts = document.querySelectorAll('.arrow-img');
let congrats = document.querySelector('.congrats');
let helpInfo = document.querySelector('.help-info');
let gameText = document.querySelector('.game-comment');
let cx = 0.5;
let cy = 0.5;
let cr = 0.402;
let tr_min = 0.559;
let tr_max = 0.626;
let dr_min = 0.922;
let dr_max = 1;
let bulldr = 0.046;
let bullr = 0.119;
let score_order = [6, 13, 4, 18 , 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10];
let mrefresh = 50;

var width = board.offsetWidth;
var height = board.offsetHeight;
var currentPlayer = 0;
var score = [301];
var mousespeedx = 0;
var mousespeedy = 0;
var prevEvent, currentEvent;
var throwstatus = false;
var throwx = 0;
var throwy = 0;
var throwxs = 0;
var throwys = 0;
var id = null;
var round = 0;
var rounds = 0;
var scores = [[0]];
var avgscore = [0];
var roundvalue = 0;
var start = score[0];

window.addEventListener('resize', setWindowSize);

function setWindowSize() {
    width = board.offsetWidth;
    height = board.offsetHeight;
}

var x = 0;
var y = 0;

function coordinate(event) {
    const rect = board.getBoundingClientRect();
    const rectd = dartboard.getBoundingClientRect();
    currentEvent = event;

    if (!throwstatus) {
        arrow.style.left = event.clientX - rectd.left + 4 + 'px';
        arrow.style.top = event.clientY - rectd.top + 80 + 'px';
        throwx = event.clientX - rect.left;
        throwy = event.clientY - rect.top;
    }

    //console.log(throwx, throwy);
}

setInterval(function() {
    if (prevEvent && currentEvent) {
        var mousex = currentEvent.screenX - prevEvent.screenX;
        var mousey = currentEvent.screenY - prevEvent.screenY;

        mousespeedx = 20 * mousex;
        mousespeedy = 20 * mousey;
    }
    prevEvent = currentEvent;
}, 50);

var roundTimeout = 0;

function counter() {
    x = throwx / width - cx;
    y = -(throwy / height - cy);
    var phi = Math.atan(y/x) * 180 / Math.PI;
    if (x < 0) {
        phi = 180 + phi; 
    }
    if (y < 0 && x > 0) {
        phi = 360 + phi;
    }
    var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / cr;

    var idx = Math.round(phi / 18);
    if (idx == 20) {
        idx = 0;
    }
    var value = score_order[idx];
    if (r > tr_min && r < tr_max) {
        value = value * 3;
    }
    if (r > dr_min && r < dr_max) {
        value = value * 2;
    }
    if (r > 1) {
        value = 0;
    }
    if (r < bulldr) {
        value = 50;
    }
    if (r > bulldr && r < bullr) {
        value = 25;
    }

    darts[round].style.visibility = "hidden";
    countinfo.childNodes[round*2].innerHTML = value;
    roundvalue += value;
    countinfo.childNodes[6].innerHTML = '(' + roundvalue + ')';

    if (score[currentPlayer] - value >= 0) {
        score[currentPlayer] = score[currentPlayer] - value;
        scoreinfo[currentPlayer].innerHTML = score[currentPlayer];
    } else {
        countinfo.childNodes[6].style.color = 'var(--main-red-color)';
        scoreinfo[currentPlayer].style.color = 'var(--main-red-color)';
        gameText.style.color = 'var(--main-red-color)';
        gameText.innerHTML = "Busted!"
        roundTimeout = setTimeout(resetround, 2000);
        score[currentPlayer] = start;
        return;
    }

    if (score[currentPlayer] == 0) {
        if (gameModes) {
            if (r > dr_min && r < dr_max) {
                scoreinfo[currentPlayer].style.color = 'var(--main-green-color)';
                scoreinfo[currentPlayer].innerHTML = score[currentPlayer];
                gameText.style.color = 'var(--main-green-color)';
                gameText.innerHTML = "Player " + (currentPlayer + 1) + " wins!";
                return;
            } else {
                countinfo.childNodes[6].style.color = 'var(--main-red-color)';
                scoreinfo[currentPlayer].style.color = 'var(--main-red-color)';
                gameText.style.color = 'var(--main-red-color)';
                gameText.innerHTML = "Busted!"
                roundTimeout = setTimeout(resetround, 2000);
                score[currentPlayer] = start;
                return;
            }
        } else {
            scoreinfo[currentPlayer].style.color = 'var(--main-green-color)';
            scoreinfo[currentPlayer].innerHTML = score[currentPlayer];
            gameText.style.color = 'var(--main-green-color)';
            gameText.innerHTML = "Player " + (currentPlayer + 1) + " wins!";
            return;
        }
    }

    if (score[currentPlayer] == 1 && gameModes) {
        countinfo.childNodes[6].style.color = 'var(--main-red-color)';
        scoreinfo[currentPlayer].style.color = 'var(--main-red-color)';
        gameText.style.color = 'var(--main-red-color)';
        gameText.innerHTML = "Busted!"
        roundTimeout = setTimeout(resetround, 2000);
        score[currentPlayer] = start;
        return;
    }

    scores[currentPlayer].push(value);
    if (rounds > 0) {
        avgscore[currentPlayer] = scores[currentPlayer].reduce((accumulator, currentValue) => accumulator + currentValue, 0) / rounds;
    } else {
        avgscore[currentPlayer] = scores[currentPlayer].reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }
    
    avginfo[currentPlayer].innerHTML = avgscore[currentPlayer].toFixed(2);

    round++;
    if (round > 2) {
        start = score[currentPlayer];
        roundTimeout = setTimeout(resetround, 2000);
    }

    throwstatus = false;
}

function resetround() {
    round = 0;
    countinfo.childNodes.forEach(child => {
        child.innerHTML = '--';
    });
    darts.forEach(dart => {
        dart.style.visibility = "visible";
    });
    arrowfly.forEach(arrowflys => {
        arrowflys.style.display = "none";
    });
    countinfo.childNodes[6].innerHTML = '(--)';
    countinfo.childNodes[6].style.color = 'white';
    scoreinfo[currentPlayer].style.color = 'rgb(130, 130, 130)';
    avginfo[currentPlayer].style.color = 'rgb(130, 130, 130)';
    scoreinfo[currentPlayer].innerHTML = score[currentPlayer];
    currentPlayer++;
    if (currentPlayer == score.length) {
        currentPlayer = 0;
        rounds++;
        roundinfo.innerHTML = rounds + 1;
    }
    scoreinfo[currentPlayer].style.color = 'white';
    avginfo[currentPlayer].style.color = 'white';
    roundvalue = 0;
    gameText.style.color = 'white';
    gameText.innerHTML = "Player " + (currentPlayer + 1);
}

function startgame() {
    score[currentPlayer] = 301;
    round = 0;
}

function dartDown() {
    arrow.style.display = 'block';
    board.style.cursor = 'none';
    throwstatus = false;
}

function dartUp() {
    board.style.cursor = 'default';
    arrow.style.display = 'none';
    throwstatus = true;
    throwxs = mousespeedx;
    throwys = mousespeedy;

    arrowfly[round].style.display = 'block';
    animateDart();
}

var dartoffsets = [[1, 22], [2, 23], [2, 23], [2, 20], [10, -24]];
var scalesIMG = [15, 12, 9, 6, 3];

function animateDart() {
    clearInterval(id);
    id = setInterval(frame, 10);
    var i = 0;
    function frame() {
        if (i == 50) {
            clearInterval(id);
            arrowfly[round].style.top = throwy + dartoffsets[4][1] + 'px';
            arrowfly[round].style.left = throwx + dartoffsets[4][0] + 'px';
            arrowfly[round].style.backgroundImage = 'url(../images/hero/png/dart_5.png)';
            arrowfly[round].style.width = scalesIMG[4] + 'rem';
            counter();
        } else {
            throwy = throwy + throwys/200 * i/50 * Math.sin(0.8) + 10/2 * Math.pow(i/35, 2);
            throwx = throwx + throwxs/400 * i/50;

            var idx = Math.floor(i/(50/4));

            arrowfly[round].style.top = throwy + dartoffsets[idx][1] + 'px';
            arrowfly[round].style.left = throwx + dartoffsets[idx][0] + 'px';
            arrowfly[round].style.backgroundImage = 'url(../images/hero/png/dart_' + (idx + 1) + '.png)';
            arrowfly[round].style.width = scalesIMG[i] + 'rem';
            i++;
        }
    }
}

function restartGame() {
    clearTimeout(roundTimeout);
    rounds = 0;
    round = 0;
    resetround();
    scoreinfo.forEach(info => {
        info.innerHTML = scoreModeToggle.innerHTML;
        info.style.color = 'rgb(130, 130, 130)';
    });
    for (var i = 0; i < score.length; i++) {
        score[i] = scoreModeToggle.innerHTML;
        avgscore[i] = 0;
        scores[i] = [0];
    }
    scoreinfo[0].style.color = 'white';
    roundinfo.innerHTML = 1;
    avginfo.forEach(info => {
        info.innerHTML = '--';
        info.style.color = 'rgb(130, 130, 130)';
    });
    avginfo[0].style.color = 'white';
    currentPlayer = 0;
}

function help() {
    if (helpInfo.style.display == "block") {
        helpInfo.style.display = "none";
    } else {
        helpInfo.style.display = "block";
    }
}

var screenToggle = document.querySelector('.fullscreen');
var dartSection = document.querySelector('section');
var screenMode = false;

function fullscreen() {
    screenMode = !screenMode;
    if (screenMode) {
        if (screenToggle.requestFullscreen) {
            dartSection.requestFullscreen();
        } else if (screenToggle.webkitRequestFullscreen) {
            dartSection.webkitRequestFullscreen();
        } else if (screenToggle.msRequestFullscreen) {
            dartSection.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

var scoreModes = [301, 501, 701];
var scoreIdx = 1;
var scoreModeToggle = document.querySelector('.score-mode');

function scoreMode() {
    scoreModeToggle.innerHTML = scoreModes[scoreIdx];
    restartGame();
    scoreIdx++;
    if (scoreIdx > 2) {
        scoreIdx = 0;
    }
}

var gameModeToggle = document.querySelector('.game-mode');
var gameModes = false;

function gameMode() {
    restartGame();
    gameModes = !gameModes;
    gameModeToggle.innerHTML = gameModeToggle.innerHTML == 'Single Out' ? 'Double Out' : 'Single Out';
}

function playerMode() {
    restartGame();
    if (score.length < 2) {
        score.push(301);
        avgscore.push(0);
        scores.push([0]);
        scoreinfo[score.length - 1].style.display = "block";
        scoreinfo[score.length - 1].style.color = "rgb(130, 130, 130)";
        avginfo[score.length - 1].style.display = "block";
        avginfo[score.length - 1].style.color = "rgb(130, 130, 130)";
    } else {
        score.pop();
        avgscore.pop();
        scores.pop();
        scoreinfo[score.length].style.display = "none";
        avginfo[score.length].style.display = "none";
    }
}
