<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Darts</title>
    <link rel="icon" type="image/x-icon" href="images/favicon.ico">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=s" rel="stylesheet">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/darts.css">
    <link rel="stylesheet" href="css/header.css">
</head>
<body>
    <section>
        <div id="menu">
            <?php include('components/header.php'); ?>
            <div id="help-info">
                <ol>
                    <li>Hold down the left mouse button to pick up a dart.</li>
                    <li>Move the mouse across the screen from the bottom towards the dartboard and then release the left mouse button to throw the dart.</li>
                    <li>The faster you swipe, the higher the dart will fly. Swiping slowly may cause the dart to drop below the board, and vice versa.</li>
                </ol> 
            </div>
            <div class="menu-toggles">
                <div class="menu-toggle" onclick="openHelp(this)">Help</div>
                <div class="menu-toggle" onclick="toggleFullscreen(this)">Fullscreen</div>
            </div>
            <p>Game Modes</p>
            <div class="game-modes">
                <div class="game-mode" onclick="changeScoreMode(this)">301</div>
                <div class="game-mode" onclick="changePlayerCount(this)">1x Player(s)</div>
                <div class="game-mode" onclick="changeGameMode(this)">Single Out</div>
            </div>
            <p>Round</p>
            <div class="scores" id="score-round">1</div>
            <p>Score</p>
            <div class="scores" id="score-total">
                <span>301</span>
                <span style="display: none">301</span>
                <span style="display: none">301</span>
            </div>
            <p>Average</p>
            <div class="scores" id="score-average">
                <span>--</span>
                <span style="display: none">--</span>
                <span style="display: none">--</span>
            </div>
            <p>Counter</p>
            <div class="scores" id="score-counter">
                <span>--</span>
                <span>--</span>
                <span>--</span>
                <span>(--)</span>
            </div>
            <div id="darts">
                <div class="dart"></div>
                <div class="dart"></div>
                <div class="dart"></div>
            </div>
            <div id="restart" onclick="restartGame()">New Game</div>
        </div>
        <div id="playzone" onmouseup="dartUp()" onmousemove="moveCursor(event)">
            <div id="game-status">Player 1</div>
            <div id="dartboard" draggable="false">
                <div class="flying-dart" draggable="false"></div>
                <div class="flying-dart" draggable="false"></div>
                <div class="flying-dart" draggable="false"></div>
                <div id="cursor" draggable="false"></div>
            </div>
        </div>
    </section>
    <script src="js/darts.js"></script>
    <script src="js/header.js"></script>
</body>
</html>