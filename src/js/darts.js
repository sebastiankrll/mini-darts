const playzoneDiv = document.getElementById('playzone')
const dartboardDiv = document.getElementById('dartboard')
const cursorDiv = document.getElementById('cursor')
const overallRoundDiv = document.getElementById('score-round')
const totalScoresDiv = document.querySelectorAll('#score-total span')
const counterScoresDiv = document.querySelectorAll('#score-counter span')
const averageScoresDiv = document.querySelectorAll('#score-average span')
const flyingDartsDiv = document.querySelectorAll('.flying-dart')
const staticDartsDiv = document.querySelectorAll('.dart')
// const congrats = document.querySelector('.congrats')
const helpInfoDiv = document.getElementById('help-info')
const gameStatusDiv = document.getElementById('game-status')

let roundTimeout = null
let currentPlayer = 0
let doubleMode = false
let scores = [301]
let avgScores = [0]
let throws = [0, 0, 0]
let throwStatus = false
let throwX = 0
let throwY = 0
let throwSpeedX = 0
let throwSpeedY = 0
let overallRound = 0
let currentRound = 0
let throwSum = 0

const moveCursor = (e) => {
    if (throwStatus) return

    const _rectZone = dartboardDiv.getBoundingClientRect()
    const _x = e.clientX - _rectZone.left
    const _y = e.clientY - _rectZone.top

    throwSpeedX = (_x - throwX)
    throwSpeedY = (_y - throwY)

    throwX = _x
    throwY = _y

    cursorDiv.style.left = throwX + 4 + 'px'
    cursorDiv.style.top = throwY + 80 + 'px'
}

const dartUp = () => {
    if (!throwStatus) {
        throwStatus = true
        staticDartsDiv[currentRound].style.visibility = "hidden"
        cursorDiv.style.display = "none"
        flyingDartsDiv[currentRound].style.display = 'block'
        animateDart()
    }
}

const animateDart = () => {
    let _animationInterval = null
    let _i = 0
    const _dartOffsets = [[1, 22], [2, 23], [2, 23], [2, 20], [10, -24]]
    const _dartScales = [15, 12, 9, 6, 3];

    const animateFrame = () => {
        if (_i == 50) {
            clearInterval(_animationInterval)

            flyingDartsDiv[currentRound].style.top = throwY + _dartOffsets[4][1] + 'px'
            flyingDartsDiv[currentRound].style.left = throwX + _dartOffsets[4][0] + 'px'
            flyingDartsDiv[currentRound].style.backgroundImage = 'url(../images/darts/dart_5.png)'
            flyingDartsDiv[currentRound].style.width = _dartScales[4] + 'rem'

            getThrow()
        } else {
            throwY += throwSpeedY * _i / 100 * Math.sin(0.8) + 10 / 2 * Math.pow(_i / 35, 2)
            throwX += throwSpeedX * _i / 100

            let idx = Math.floor(_i / (50 / 4))

            flyingDartsDiv[currentRound].style.top = throwY + _dartOffsets[idx][1] + 'px'
            flyingDartsDiv[currentRound].style.left = throwX + _dartOffsets[idx][0] + 'px'
            flyingDartsDiv[currentRound].style.backgroundImage = 'url(../images/darts/dart_' + (idx + 1) + '.png)'
            flyingDartsDiv[currentRound].style.width = _dartScales[_i] + 'rem'

            _i++
        }
    }

    _animationInterval = setInterval(animateFrame, 10)
}

const calculateThrownValue = () => {
    const _cx = 0.5
    const _cy = 0.5
    const _cr = 0.402
    const _tr_min = 0.559
    const _tr_max = 0.626
    const _dr_min = 0.922
    const _dr_max = 1
    const _bulldr = 0.046
    const _bullr = 0.119
    const _scoreOrder = [6, 13, 4, 18, 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10]

    const _x = throwX / dartboardDiv.offsetWidth - _cx
    const _y = -(throwY / dartboardDiv.offsetHeight - _cy)
    let _phi = Math.atan(_y / _x) * 180 / Math.PI

    if (_x < 0) { _phi += 180 }
    if (_y < 0 && _x > 0) { _phi += 360 }

    const _r = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2)) / _cr
    let _idx = Math.round(_phi / 18)
    if (_idx == 20) { _idx = 0 }

    if (_r > _tr_min && _r < _tr_max) {
        return {
            value: _scoreOrder[_idx] * 3,
            isDouble: false
        }
    }
    if (_r > _dr_min && _r < _dr_max) {
        return {
            value: _scoreOrder[_idx] * 3,
            isDouble: true
        }
    }
    if (_r > 1) {
        return {
            value: 0,
            isDouble: false
        }
    }
    if (_r < _bulldr) {
        return {
            value: 50,
            isDouble: true
        }
    }
    if (_r > _bulldr && _r < _bullr) {
        return {
            value: 25,
            isDouble: false
        }
    }

    return {
        value: _scoreOrder[_idx],
        isDouble: false
    }
}

const getThrow = () => {
    const _throw = calculateThrownValue()

    counterScoresDiv[currentRound].innerHTML = _throw.value
    throwSum += _throw.value
    counterScoresDiv[3].innerHTML = `(${throwSum})`
    throws[currentRound] = _throw.value

    const _newScore = scores[currentPlayer] - throws.reduce((a, b) => a + b, 0)

    // Overthrown
    if (_newScore < 0) {
        setBusted()
        return
    }

    // Single-out throw in double mode
    if (_newScore == 0 && doubleMode && !_throw.isDouble) {
        setBusted()
        return
    }

    // Exception: Only 1 left in double mode
    if (_newScore == 1 && doubleMode) {
        setBusted()
        return
    }

    totalScoresDiv[currentPlayer].innerHTML = _newScore

    // Win scenarios
    if (_newScore == 0) {
        setWon()
        return
    }

    currentRound++
    if (currentRound > 2) {
        scores[currentPlayer] = _newScore
        roundTimeout = setTimeout(resetRound, 2000)
    } else {
        throwStatus = false
        cursorDiv.style.display = "block"
    }
}

const setBusted = () => {
    totalScoresDiv[currentPlayer].innerHTML = scores[currentPlayer]

    totalScoresDiv[currentPlayer].style.color = 'var(--main-red-color)'
    gameStatusDiv.style.color = 'var(--main-red-color)'
    gameStatusDiv.innerHTML = "Busted!"

    roundTimeout = setTimeout(resetRound, 2000)
}

const setWon = () => {
    totalScoresDiv[currentPlayer].style.color = 'var(--main-green-color)'
    gameStatusDiv.style.color = 'var(--main-green-color)'
    gameStatusDiv.innerHTML = "Player " + (currentPlayer + 1) + " wins!"
}

const calculateAverage = () => {
    const _previousThrows = overallRound * 3
    const _currentSum = throws.reduce((a, b) => a + b, 0)
    const _remainingThrows = 2 - currentRound

    let _predictedThrows = []

    if (_remainingThrows > 0) {
        const _predictedValue = currentRound === 0 ? currentThrows[0] : sumCurrent / (currentRound + 1)
        _predictedThrows = Array(_remainingThrows).fill(_predictedValue)
    }

    const _predictedSum = _currentSum + _predictedThrows.reduce((a, b) => a + b, 0)

    const _newAverage =
        ((avgScores[currentPlayer] * totalPreviousThrows) + predictedSum) /
        (totalPreviousThrows + throwsPerRound);

    return {
        predictedThrows,
        predictedSum,
        predictedOverallAverage: newAverage,
    };

    if (rounds > 0) {
        avgscore[currentPlayer] = scores[currentPlayer].reduce((accumulator, currentValue) => accumulator + currentValue, 0) / rounds
    } else {
        avgscore[currentPlayer] = scores[currentPlayer].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

    averageScoresDiv[currentPlayer].innerHTML = avgscore[currentPlayer].toFixed(2)
}

const resetRound = () => {
    currentRound = 0
    throws = [0, 0, 0]
    throwSum = 0
    throwStatus = false
    cursorDiv.style.display = "block"

    counterScoresDiv.forEach(span => {
        span.innerHTML = '--'
    })
    staticDartsDiv.forEach(dart => {
        dart.style.visibility = "visible"
    })
    flyingDartsDiv.forEach(arrowflys => {
        arrowflys.style.display = "none"
    })

    // totalScoresDiv[currentPlayer].style.color = 'rgb(130, 130, 130)'
    // averageScoresDiv[currentPlayer].style.color = 'rgb(130, 130, 130)'

    totalScoresDiv[currentPlayer].style.color = 'white'

    currentPlayer++
    if (currentPlayer >= scores.length - 1) {
        currentPlayer = 0
        overallRound++
        overallRoundDiv.innerHTML = overallRound + 1
    }

    gameStatusDiv.style.color = 'white'
    gameStatusDiv.innerHTML = "Player " + (currentPlayer + 1)
}


// Game settings

const restartGame = () => {
    clearTimeout(roundTimeout)

    rounds = 0
    resetRound()

    totalScoresDiv.forEach(info => {
        info.innerHTML = scoreModeToggle.innerHTML
        info.style.color = 'rgb(130, 130, 130)'
    })
    for (var i = 0; i < score.length; i++) {
        score[i] = scoreModeToggle.innerHTML
        avgscore[i] = 0
        scores[i] = [0]
    }
    totalScoresDiv[0].style.color = 'white'
    currentRoundDiv.innerHTML = 1
    averageScoresDiv.forEach(info => {
        info.innerHTML = '--'
        info.style.color = 'rgb(130, 130, 130)'
    })
    averageScoresDiv[0].style.color = 'white'
    currentPlayer = 0
}

function help() {
    if (helpInfoDiv.style.display == "block") {
        helpInfoDiv.style.display = "none";
    } else {
        helpInfoDiv.style.display = "block";
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
        totalScoresDiv[score.length - 1].style.display = "block";
        totalScoresDiv[score.length - 1].style.color = "rgb(130, 130, 130)";
        averageScoresDiv[score.length - 1].style.display = "block";
        averageScoresDiv[score.length - 1].style.color = "rgb(130, 130, 130)";
    } else {
        score.pop();
        avgscore.pop();
        scores.pop();
        totalScoresDiv[score.length].style.display = "none";
        averageScoresDiv[score.length].style.display = "none";
    }
}