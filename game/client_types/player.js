/**
 * # Player type implementation of the game stages
 * Copyright(c) 2020 arjsto <a.stolk8@gmail.com>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

module.exports = function (treatmentName, settings, stager, setup, gameRoom) {

    // Import other functions used in the game.
    var cbs = require(__dirname + '/includes/player.callbacks.js');

    // Init callback.
    stager.setOnInit(function () {
        // Setup page: header + frame.
        var header = W.generateHeader();
        var frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);
        this.visualTimer = node.widgets.append('VisualTimer', header);
        this.doneButton = node.widgets.append('DoneButton', header);
        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)

        // Trial-specific token information.
        node.game.token = {
            shape: 3, // 1, 2, 3 (rectangle, circle, triangle)
            xPos: 0, // -1, 0, 1
            yPos: 0, // -1, 0, 1
            angle: 0, // 0, 90, 180, 270
            color: [255, 204, 0, 1], // blue: [51, 51, 255], yellow: [255, 204, 0]
            scale: 1, // for outside token this is .75
            state: 0, // 0, 1, 2 (ready, in-use, done)
            usetime: [], // usage time
            maxtime: 10000 // maximum time alloted
        };
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });

    // SENDER TURN
    stager.extendStep('sender', {
        frame: 'canvas.htm',
        init: function () {
            W.init({ adjustFrameHeight: false });
        },
        callbacks: {
            init_gameboard: cbs.init_gameboard,
            draw_gameboard: cbs.draw_gameboard,
            draw_token: cbs.draw_token,
            move_token: cbs.move_token,
        },
        roles: {
            SENDER: {     // SENDER SCREEN
                //donebutton: false,
                timer: settings.bidTime,
                cb: function () {
                    var callbacks = node.game.getProperty('callbacks');
                    callbacks.init_gameboard();
                    callbacks.draw_gameboard();
                    //callbacks.draw_token();
                    //callbacks.move_token();
                },

                    /*var button, offer;

                    // Make the dictator display visible.
                    W.getElementById('dictator').style.display = '';
                    // W.gid = W.getElementById.
                    button = W.gid('submitOffer');
                    offer =  W.gid('offer');

                    // Listen on click event.
                    button.onclick = function() {
                        var decision;

                        // Validate offer.
                        decision = node.game.isValidBid(offer.value);
                        if ('number' !== typeof decision) {
                            W.writeln('Please enter a number between ' +
                                      '0 and 100.', 'dictator');
                            return;
                        }
                        button.disabled = true;

                        // Mark the end of the round, and
                        // store the decision in the server.
                        node.done({ offer: decision });
                     };
                },
                */
                timeup: function () {
                    var n;
                    // Generate random value.
                    n = J.randomInt(-1, 100);
                    // Set value in the input box.
                    W.gid('offer').value = n;
                    // Click the submit button to trigger the event listener.
                    W.gid('submitOffer').click();
                }
            },
            RECEIVER: {   // RECEIVER SCREEN
                cb: function () {
                    var callbacks = node.game.getProperty('callbacks');
                    callbacks.init_gameboard();
                    callbacks.draw_gameboard();
                },
                /*
                cb: function () {

                    var span, div, dotsObj;

                    // Make the observer display visible.
                    div = W.getElementById('observer').style.display = '';
                    span = W.getElementById('dots');
                    dotsObj = W.addLoadingDots(span);

                    node.on.data('decision', function (msg) {
                        dotsObj.stop();
                        W.setInnerHTML('waitingFor', 'Decision arrived: ');
                        W.setInnerHTML('decision',
                            'The dictator offered: ' +
                            msg.data + ' ECU.');

                        setTimeout(function () {
                            node.done();
                        }, 5000);
                    });
                },*/
            }
        }
    });

    // RECEIVER TURN
    stager.extendStep('receiver', {
        /////////////////////////////////////////////////////////////
        // nodeGame hint: role and partner
        //
        // By default `role` and a `partner` are valid only within a step,
        // but it is possible to carry over the values between steps.
        //
        // Role and partner meaning:
        //   - falsy      -> delete (default),
        //   - true       -> keep current value,
        //   - string     -> as is (must exist),
        //   - function   -> must return null or a valid role name
        //////////////////////////////////////////////////////////
        role: function() { return this.role; },
        partner: function() { return this.partner; },
        frame: 'canvas.htm',
        init: function () {
            W.init({ adjustFrameHeight: false });
        },
        callbacks: {
            init_gameboard: cbs.init_gameboard,
            draw_gameboard: cbs.draw_gameboard,
        },
        roles: {
            RECEIVER: {   // RECEIVER SCREEN
                timer: settings.bidTime,
                cb: function () {
                    var callbacks = node.game.getProperty('callbacks');
                    callbacks.init_gameboard();
                    callbacks.draw_gameboard();
                },
            },
            SENDER: {     // SENDER SCREEN
                cb: function () {
                    var callbacks = node.game.getProperty('callbacks');
                    callbacks.init_gameboard();
                    callbacks.draw_gameboard();
                },
            },
        }
    });

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function () {
            node.game.visualTimer.setToZero();
        }
    });
};
