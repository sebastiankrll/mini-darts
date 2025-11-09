<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Darts</title>
    <link rel="icon" type="image/x-icon" href="images/favicon.ico">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/darts.css">
</head>
<body>
    <section onmousemove="coordinate(event)">
        <div class="menu">
            <div class="menu-settings">
                <div class="menu-setting" onclick="help()">Help</div>
                <div class="menu-setting" onclick="fullscreen()">Fullscreen</div>
            </div>
            <div class="menu-settings">
                <div class="menu-setting" onclick="scoreMode()">301</div>
                <div class="menu-setting" onclick="playerMode()">Player(s)</div>
                <div class="menu-setting" onclick="gameMode()">Single Out</div>
            </div>  
            <div class="help-info">
                <ol>
                    <li>Press and hold the left mouse button to take a dart.</li>
                    <li>Swipe up the mouse and release the left mouse button to throw the dart.</li>
                </ol> 
                <br>Tip: The dart will fly higher, if you swipe fast. Swiping slowly may cause the dart to drop.
            </div>
            <p>Round</p>
            <div class="infos">1</div>
            <p>Score</p>
            <div class="infos">
                <div class="info-score">301</div>
                <div class="info-score" style="display:none">301</div>
                <div class="info-score" style="display:none">301</div>
            </div>
            <p>Counter</p>
            <div class="info-counter infos"><div class="spanner">--</div> <div class="spanner">--</div> <div class="spanner">--</div> <div class="spanner">(--)</div></div>
            <p>Average</p>
            <div class="infos">
                <div class="info-average">--</div>
                <div class="info-average" style="display:none">--</div>
                <div class="info-average" style="display:none">--</div>
            </div>
            <div class="darts">
                <div class="arrow-img"></div>
                <div class="arrow-img"></div>
                <div class="arrow-img"></div>
            </div>
            <div class="restart-button" onclick="restartGame()">Restart</div>
        </div>
        <div class="dartboard" onmousedown="dartDown()" onmouseup="dartUp()">
            <div class="game-comment">Player 1</div>
            <div class="board">
                <div class="flying-dart"></div>
                <div class="flying-dart"></div>
                <div class="flying-dart"></div>
            </div>
            <div class="cursor"></div>
        </div>
    </section>
    <script src="js/darts.js"></script>
    
</body>
</html>