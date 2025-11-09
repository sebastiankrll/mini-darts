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

const scoreModes = [301, 501, 701]

let roundTimeout = null
let currentPlayer = 0
let doubleMode = false
let scores = [301]
let tempScore = 301
let throws = [[]]
let throwStatus = false
let throwX = 0
let throwY = 0
let throwSpeedX = 0
let throwSpeedY = 0
let overallRound = 0
let currentRound = 0
let throwSum = 0
let scoreModeIndex = 0
let isFullscreen = false

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
    throws[currentPlayer].push(_throw.value)

    tempScore -= _throw.value

    // Overthrown
    if (tempScore < 0) {
        setBusted()
        return
    }

    // Single-out throw in double mode
    if (tempScore == 0 && doubleMode && !_throw.isDouble) {
        setBusted()
        return
    }

    // Exception: Only 1 left in double mode
    if (tempScore == 1 && doubleMode) {
        setBusted()
        return
    }

    const _average = getAverage()
    averageScoresDiv[currentPlayer].innerHTML = _average.toFixed(2)
    totalScoresDiv[currentPlayer].innerHTML = tempScore

    // Win scenarios
    if (tempScore == 0) {
        setWon()
        return
    }

    currentRound++
    if (currentRound > 2) {
        scores[currentPlayer] = tempScore
        console.log(throws)
        roundTimeout = setTimeout(advanceRound, 2000)
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

    roundTimeout = setTimeout(advanceRound, 2000)
}

const setWon = () => {
    totalScoresDiv[currentPlayer].style.color = 'var(--main-green-color)'
    gameStatusDiv.style.color = 'var(--main-green-color)'
    gameStatusDiv.innerHTML = "Player " + (currentPlayer + 1) + " wins!"
}

const getAverage = () => {
    if (throws[currentPlayer].length === 0) return 0

    const _sums = []

    for (let i = 0; i < throws[currentPlayer].length; i += 3) {
        const _chunk = throws[currentPlayer].slice(i, i + 3)
        const _sum = _chunk.reduce((a, b) => a + b, 0)
        _sums.push(_sum)
    }

    const _total = _sums.reduce((a, b) => a + b, 0)
    return _total / _sums.length
}

const resetRound = () => {
    currentRound = 0
    throwSum = 0
    throwStatus = false
    cursorDiv.style.display = "block"

    counterScoresDiv.forEach(span => {
        span.innerHTML = '--'
    })
    counterScoresDiv[3].innerHTML = "(--)"
    staticDartsDiv.forEach(dart => {
        dart.style.visibility = "visible"
    })
    flyingDartsDiv.forEach(arrowflys => {
        arrowflys.style.display = "none"
    })

    gameStatusDiv.style.color = 'white'
    gameStatusDiv.innerHTML = "Player " + (currentPlayer + 1)
}

const advanceRound = () => {
    totalScoresDiv[currentPlayer].style.color = 'rgb(130, 130, 130)'
    averageScoresDiv[currentPlayer].style.color = 'rgb(130, 130, 130)'

    currentPlayer++
    if (currentPlayer >= scores.length) {
        currentPlayer = 0
        overallRound++
        overallRoundDiv.innerHTML = overallRound + 1
    }

    tempScore = scores[currentPlayer]

    totalScoresDiv[currentPlayer].style.color = 'white'
    averageScoresDiv[currentPlayer].style.color = 'white'

    resetRound()
}


// Game settings

const restartGame = () => {
    clearTimeout(roundTimeout)
    resetRound()

    throws = Array.from({ length: scores.length }, () => [])

    overallRoundDiv.innerHTML = 1
    currentPlayer = 0
    overallRound = 0

    scores.fill(scoreModes[scoreModeIndex])
    tempScore = scoreModes[scoreModeIndex]

    totalScoresDiv.forEach(span => {
        span.innerHTML = scoreModes[scoreModeIndex]
        span.style.color = 'rgb(130, 130, 130)'
    })
    totalScoresDiv[0].style.color = 'white'

    averageScoresDiv.forEach(span => {
        span.innerHTML = '--'
        span.style.color = 'rgb(130, 130, 130)'
    })
    averageScoresDiv[0].style.color = 'white'
}

const openHelp = (element) => {
    element.innerHTML = helpInfoDiv.style.display === "block" ? "Help" : "Close"
    helpInfoDiv.style.display = helpInfoDiv.style.display === "block" ? "none" : "block"
}

const toggleFullscreen = (element) => {
    const section = document.querySelector('section')
    isFullscreen = !isFullscreen

    if (isFullscreen) {
        element.innerHTML = "Normal Screen"
        section.requestFullscreen()
    } else {
        element.innerHTML = "Fullscreen"
        document.exitFullscreen()
    }
}

const changeScoreMode = (element) => {
    scoreModeIndex = (scoreModeIndex + 1) % 3
    element.innerHTML = scoreModes[scoreModeIndex]
    restartGame()
}

const changeGameMode = (element) => {
    doubleMode = !doubleMode
    element.innerHTML = doubleMode ? 'Double Out' : 'Single Out'
    restartGame()
}

const changePlayerCount = (element) => {
    if (scores.length < 3) {
        scores.push(301)

        totalScoresDiv[scores.length - 1].style.display = "block"
        totalScoresDiv[scores.length - 1].style.color = "rgb(130, 130, 130)"
        averageScoresDiv[scores.length - 1].style.display = "block"
        averageScoresDiv[scores.length - 1].style.color = "rgb(130, 130, 130)"

        element.innerHTML = `${scores.length}x Player(s)`
    } else {
        for (let i = 1; i < scores.length; i++) {
            totalScoresDiv[i].style.display = "none"
            averageScoresDiv[i].style.display = "none"
        }

        scores = [301]
        element.innerHTML = "1x Player(s)"
    }

    restartGame()
}