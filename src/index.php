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
</head>
<body onmousemove="coordinate(event)">
    <div id="menu">
        <div class="menu-settings">
            <div class="menu-setting" onclick="help()">Help</div>
            <div class="menu-setting" onclick="fullscreen()">Fullscreen</div>
        </div>
        <div class="menu-settings">
            <div class="menu-setting" onclick="scoreMode()">301</div>
            <div class="menu-setting" onclick="playerMode()">Player(s)</div>
            <div class="menu-setting" onclick="gameMode()">Single Out</div>
        </div>  
        <div id="help-info">
            <ol>
                <li>Press and hold the left mouse button to take a dart.</li>
                <li>Swipe up the mouse and release the left mouse button to throw the dart.</li>
            </ol> 
            <br>Tip: The dart will fly higher, if you swipe fast. Swiping slowly may cause the dart to drop.
        </div>
        <p>Round</p>
        <div class="scores">1</div>
        <p>Score</p>
        <div class="scores" id="score-overall">
            <div class="score">301</div>
            <div class="score" style="display:none">301</div>
            <div class="score" style="display:none">301</div>
        </div>
        <p>Counter</p>
        <div class="scores" id="score-round">
            <span>--</span>
            <span>--</span>
            <span>--</span>
            <span>(--)</span>
        </div>
        <p>Average</p>
        <div class="scores">
            <div class="score">--</div>
            <div class="score" style="display:none">--</div>
            <div class="score" style="display:none">--</div>
        </div>
        <div id="darts">
            <div class="dart"></div>
            <div class="dart"></div>
            <div class="dart"></div>
        </div>
        <div id="restart" onclick="restartGame()">Restart</div>
    </div>
    <div id="playzone" onmousedown="dartDown()" onmouseup="dartUp()">
        <div id="active-player">Player 1</div>
        <div id="dartboard">
            <div class="flying-dart"></div>
            <div class="flying-dart"></div>
            <div class="flying-dart"></div>
        </div>
        <div id="cursor"></div>
    </div>
    <script src="js/darts.js"></script>
</body>
</html>