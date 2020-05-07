/**
* # Functions used by the client of Ultimatum Game
* Copyright(c) 2019 Stefano Balietti
* MIT Licensed
*
* http://www.nodegame.org
*/
module.exports = CanvasManager;

function CanvasManager(token) {
    var that;

    // Keep reference to this for listeners.
    that = this;

    // Token.
    this.token = token;

    // Canvas.
    var canvas = this.canvas = W.gid('mycanvas');

    this.board = {
        xCenter: canvas.width / 2, // resolution-independent
        yCenter: canvas.height / 2,
        size: canvas.height / 2, // half of the screen height
        unit: canvas.height / 2 / 3, // one-third of the board size
        xPos: new Array(3), // 1 x 3
        yPos: new Array(3)
    };



    // Initialize gameboard. FIXME: make it adjust when resizing the browser?
    this.init = function() {

        for (var i = 0; i < this.board.xPos.length; i++) {
            this.board.xPos[i] = new Array(3); // 3 x 3
            this.board.yPos[i] = new Array(3);
        };

        // coordinate [0,0] is top left
        this.board.xPos[0][0] = this.board.xCenter - this.board.unit; // field 1
        this.board.yPos[0][0] = this.board.yCenter + this.board.unit;
        this.board.xPos[0][1] = this.board.xCenter;                        // field 2
        this.board.yPos[0][1] = this.board.yCenter + this.board.unit;
        this.board.xPos[0][2] = this.board.xCenter + this.board.unit; // field 3
        this.board.yPos[0][2] = this.board.yCenter + this.board.unit;
        this.board.xPos[1][0] = this.board.xCenter - this.board.unit; // field 4
        this.board.yPos[1][0] = this.board.yCenter;
        this.board.xPos[1][1] = this.board.xCenter;                        // field 5
        this.board.yPos[1][1] = this.board.yCenter
        this.board.xPos[1][2] = this.board.xCenter + this.board.unit; // field 6
        this.board.yPos[1][2] = this.board.yCenter
        this.board.xPos[2][0] = this.board.xCenter - this.board.unit; // field 7
        this.board.yPos[2][0] = this.board.yCenter - this.board.unit;
        this.board.xPos[2][1] = this.board.xCenter;                        // field 8
        this.board.yPos[2][1] = this.board.yCenter - this.board.unit;
        this.board.xPos[2][2] = this.board.xCenter + this.board.unit; // field 9
        this.board.yPos[2][2] = this.board.yCenter - this.board.unit;

    };

    // Draw gameboard.
    this.drawCanvas = function() {
        //node.game.canvas.addEventListener('keydown', move_token, true); // FIXME: this breaks things
        var c = canvas.getContext('2d');
        c.fillStyle = "rgba(178.5, 178.5, 178.5, 1)"; // light grey backdrop
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.beginPath();
        for (var i = 0; i < this.board.xPos.length; i++) {
            for (var j = 0; j < this.board.yPos.length; j++) {
                c.lineWidth = this.board.size / 175;
                c.rect(this.board.xPos[i][j] - this.board.unit / 2, this.board.yPos[i][j] - this.board.unit / 2, this.board.unit, this.board.unit);
                c.strokeStyle = "rgba(76.5, 76.5, 76.5, 1)"; // dark grey outlines
            };
        };
        c.stroke();

    };

    // Draw token.
    this.drawToken = function() {
        var c = canvas.getContext('2d');
        //draw_gameboard; // (re)draw gameboard to clear the previous token
        c.save();
        c.translate(this.board.xPos[0][this.token.xPos + 1], this.board.yPos[this.token.yPos + 1][0]); // translate
        c.rotate(this.token.angle * Math.PI / 180); // rotate
        c.beginPath();
        if (this.token.shape === 1) { // draw rectangle
            c.rect(-.4 * this.board.unit * this.token.scale, -.125 * this.board.unit * this.token.scale, .8 * this.board.unit * this.token.scale, .25 * this.board.unit * this.token.scale);
        } else if (this.token.shape === 2) { // draw circle
            c.arc(0, 0, .3 * this.board.unit * this.token.scale, 0, Math.PI * 2, false);
        } else if (this.token.shape === 3) { // draw triangle
            var height = .7 * this.board.unit * (Math.sqrt(3) / 2) * this.token.scale;
            c.moveTo(0, -height / 2);
            c.lineTo(height / 2, height / 2);
            c.lineTo(-height / 2, height / 2);
            c.closePath();
        };
        c.strokeStyle = "rgba(" + this.token.color + ")";
        c.stroke();
        c.fillStyle = "rgba(" + this.token.color + ")";
        c.fill();
        c.restore();
    };

    // Move token.
    this.moveToken = function(event) {
        console.log('EVENT!')
        // To debug things.
        debugger
        // Check if this is an event or a direct call.
        if (event.preventDefault) event.preventDefault();
        if (event.code == 'Space') {
            if (this.token.state == 0) {
                console.log('start');
                this.token.state = 1; // enable shape movement
                this.token.usetime = Date.now();
            } else if (this.token.state == 1) {
                console.log('stop');
                this.token.state = 2; // lock in the shape at the current location
                //FIXME: give the floor, ditto for startButton.max?
            }
        }
        if (this.token.state == 1 &&
            // Time since the beginning of the step.
            // Can set custom timestamp with node.timer.setTimestamp('xyz');
            // See: https://github.com/nodeGame/nodegame/wiki/Timer-API-v5
            (node.timer.getTimeSince('step')) < this.token.maxtime) {

            console.log(Date.now() - this.token.usetime);
            if (event.code == 'ArrowUp') {
                console.log('up');
                this.token.yPos += 1;
                if (this.token.yPos > 1) {
                    this.token.yPos = 1;
                }
            }
            else if (event.code == 'ArrowRight') {
                console.log('right');
                this.token.xPos += 1;
                if (this.token.xPos > 1) {
                    this.token.xPos = 1;
                }
            }
            else if (event.code == 'ArrowDown') {
                console.log('down');
                this.token.yPos -= 1;
                if (this.token.yPos < -1) {
                    this.token.yPos = -1;
                }
            }
            else if (event.code == 'ArrowLeft') {
                console.log('left');
                this.token.xPos -= 1;
                if (this.token.xPos < -1) {
                    this.token.xPos = -1;
                }
            }
            else if (event.code == 'ShiftLeft') {
                console.log('rotateleft');
                this.token.angle += 270;
                if (this.token.angle >= 360) {
                    this.token.angle -= 360;
                }
            }
            else if (event.code == 'ShiftRight') {
                console.log('rotateright');
                this.token.angle += 90;
                if (this.token.angle >= 360) {
                    this.token.angle -= 360;
                }
            }
        }
    };

    this.addEventListener = function() {

        // Does not fully work yet.

        // The key press may be in the "header" or in the "frame".
        document.body.addEventListener('keypress', function(event) {
            that.moveToken(event);
        });
        W.getFrameDocument().body.addEventListener('keypress', function(event) {
            that.moveToken(event);
        });
    };
}
