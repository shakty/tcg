/**
 * # Functions used by the client of Ultimatum Game
 * Copyright(c) 2019 Stefano Balietti
 * MIT Licensed
 *
 * http://www.nodegame.org
 */

module.exports = {
    init_gameboard: init_gameboard,
    draw_gameboard: draw_gameboard,
    draw_token: draw_token,
    move_token: move_token,
};

// Initialize gameboard.     FIXME: make it adjust when resizing the browser?
function init_gameboard() {
    var canvas = W.gid('mycanvas');
    node.game.board = {
        xCenter: canvas.width / 2, // resolution-independent
        yCenter: canvas.height / 2,
        size: canvas.height / 2, // half of the screen height
        unit: canvas.height / 2 / 3, // one-third of the board size
        xPos: new Array(3), // 1 x 3
        yPos: new Array(3)
    };
    for (var i = 0; i < node.game.board.xPos.length; i++) {
        node.game.board.xPos[i] = new Array(3); // 3 x 3
        node.game.board.yPos[i] = new Array(3);
    };
    // coordinate [0,0] is top left
    node.game.board.xPos[0][0] = node.game.board.xCenter - node.game.board.unit; // field 1
    node.game.board.yPos[0][0] = node.game.board.yCenter + node.game.board.unit;
    node.game.board.xPos[0][1] = node.game.board.xCenter;                        // field 2
    node.game.board.yPos[0][1] = node.game.board.yCenter + node.game.board.unit;
    node.game.board.xPos[0][2] = node.game.board.xCenter + node.game.board.unit; // field 3
    node.game.board.yPos[0][2] = node.game.board.yCenter + node.game.board.unit;
    node.game.board.xPos[1][0] = node.game.board.xCenter - node.game.board.unit; // field 4
    node.game.board.yPos[1][0] = node.game.board.yCenter;
    node.game.board.xPos[1][1] = node.game.board.xCenter;                        // field 5
    node.game.board.yPos[1][1] = node.game.board.yCenter
    node.game.board.xPos[1][2] = node.game.board.xCenter + node.game.board.unit; // field 6
    node.game.board.yPos[1][2] = node.game.board.yCenter
    node.game.board.xPos[2][0] = node.game.board.xCenter - node.game.board.unit; // field 7
    node.game.board.yPos[2][0] = node.game.board.yCenter - node.game.board.unit;
    node.game.board.xPos[2][1] = node.game.board.xCenter;                        // field 8
    node.game.board.yPos[2][1] = node.game.board.yCenter - node.game.board.unit;
    node.game.board.xPos[2][2] = node.game.board.xCenter + node.game.board.unit; // field 9
    node.game.board.yPos[2][2] = node.game.board.yCenter - node.game.board.unit;
}

// Draw gameboard.
function draw_gameboard() {
    //node.game.canvas.addEventListener('keydown', move_token, true); // FIXME: this breaks things
    var canvas = W.gid('mycanvas');
    var c = canvas.getContext('2d');
    c.fillStyle = "rgba(178.5, 178.5, 178.5, 1)"; // light grey backdrop
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.beginPath();
    for (var i = 0; i < node.game.board.xPos.length; i++) {
        for (var j = 0; j < node.game.board.yPos.length; j++) {
            c.lineWidth = node.game.board.size / 175;
            c.rect(node.game.board.xPos[i][j] - node.game.board.unit / 2, node.game.board.yPos[i][j] - node.game.board.unit / 2, node.game.board.unit, node.game.board.unit);
            c.strokeStyle = "rgba(76.5, 76.5, 76.5, 1)"; // dark grey outlines
        };
    };
    c.stroke();
}

// Draw token.
function draw_token() {
    var canvas = W.gid('mycanvas');
    var c = canvas.getContext('2d');
    //draw_gameboard; // (re)draw gameboard to clear the previous token
    c.save();
    c.translate(node.game.board.xPos[0][node.game.token.xPos + 1], node.game.board.yPos[node.game.token.yPos + 1][0]); // translate
    c.rotate(node.game.token.angle * Math.PI / 180); // rotate
    c.beginPath();
    if (node.game.token.shape === 1) { // draw rectangle
        c.rect(-.4 * node.game.board.unit * node.game.token.scale, -.125 * node.game.board.unit * node.game.token.scale, .8 * node.game.board.unit * node.game.token.scale, .25 * node.game.board.unit * node.game.token.scale);
    } else if (node.game.token.shape === 2) { // draw circle
        c.arc(0, 0, .3 * node.game.board.unit * node.game.token.scale, 0, Math.PI * 2, false);
    } else if (node.game.token.shape === 3) { // draw triangle
        var height = .7 * node.game.board.unit * (Math.sqrt(3) / 2) * node.game.token.scale;
        c.moveTo(0, -height / 2);
        c.lineTo(height / 2, height / 2);
        c.lineTo(-height / 2, height / 2);
        c.closePath();
    };
    c.strokeStyle = "rgba(" + node.game.token.color + ")";
    c.stroke();
    c.fillStyle = "rgba(" + node.game.token.color + ")";
    c.fill();
    c.restore();
};

// Move token.
function move_token(event) {
    event.preventDefault();
    if (event.code == 'Space') {
        if (node.game.token.state == 0) {
            console.log('start');
            draw_token();
            node.game.token.state = 1; // enable shape movement
            node.game.token.usetime = Date.now();
        } else if (node.game.token.state == 1) {
            console.log('stop');
            node.game.token.state = 2; // lock in the shape at the current location
            //FIXME: give the floor, ditto for startButton.max?
        }
    }
    if (node.game.token.state == 1 && (Date.now() - node.game.token.usetime) < node.game.token.maxtime) {
        console.log(Date.now() - node.game.token.usetime);
        if (event.code == 'ArrowUp') {
            console.log('up');
            node.game.token.yPos += 1;
            if (node.game.token.yPos > 1) {
                node.game.token.yPos = 1;
            }
            draw_token();
        }
        if (event.code == 'ArrowRight') {
            console.log('right');
            node.game.token.xPos += 1;
            if (node.game.token.xPos > 1) {
                node.game.token.xPos = 1;
            }
            draw_token();
        }
        if (event.code == 'ArrowDown') {
            console.log('down');
            node.game.token.yPos -= 1;
            if (node.game.token.yPos < -1) {
                node.game.token.yPos = -1;
            }
            draw_token();
        }
        if (event.code == 'ArrowLeft') {
            console.log('left');
            node.game.token.xPos -= 1;
            if (node.game.token.xPos < -1) {
                node.game.token.xPos = -1;
            }
            draw_token();
        }
        if (event.code == 'ShiftLeft') {
            console.log('rotateleft');
            node.game.token.angle += 270;
            if (node.game.token.angle >= 360) {
                node.game.token.angle -= 360;
            }
            draw_token();
        }
        if (event.code == 'ShiftRight') {
            console.log('rotateright');
            node.game.token.angle += 90;
            if (node.game.token.angle >= 360) {
                node.game.token.angle -= 360;
            }
            draw_token();
        }
    }
}
