/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2020 arjsto <a.stolk8@gmail.com>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    stager.setOnInit(function() {
        // Initialize the client.
    });

    //////////////////////////////////////////////
    // nodeGame hint: player list's size handlers
    //
    // `minPlayers` triggers the execution of a callback in the case
    // the number of players (including this client) falls below the
    // chosen threshold.
    //
    // Related variables are: `maxPlayers`, and `exactPlayers`.
    /////////////////////////////////////
    stager.setDefaultProperty('minPlayers', [
        settings.MIN_PLAYERS,
        function() {
            var step = node.game.plot.normalizeGameStage('end');
            node.game.gotoStep(step);
        }
    ]);

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });

    stager.extendStep('sender', {     // FIXME: why can't this be integrated in the tcg stager/step below?
        ////////////////////////////////////
        // nodeGame hint: the matcher object
        //
        // The matcher step-property is read by the `MatcherManager` object
        // at `node.game.matcher`. This object takes care of matching together
        // players in pairs and/or to assign them a role.
        // //////////////////////////////////////////////
        matcher: {
            roles: [ 'SENDER', 'RECEIVER' ],
            match: 'round_robin',
            cycle: 'mirror_invert',
            // skipBye: false,
            // setPartner: true,
        }
    });

    stager.extendStep('tcg', {
        cb: function() {
            node.once.data('done', function(msg) {
                var offer, observer;
                offer = msg.data.offer;

                // Validate incoming offer.
                if (false === J.isInt(offer, 0, 100)) {
                    console.log('Invalid offer received from ' + msg.from);
                    // If dictator is cheating re-set his/her offer.
                    msg.data.offer = settings.defaultOffer;
                    // Mark the item as manipulated.
                    msg.data.originalOffer = offer;
                }

                observer = node.game.matcher.getMatchFor(msg.from);
                // Send the decision to the other player.
                node.say('decision', observer, msg.data.offer);

            });
            console.log('Game round: ' + node.player.stage.round);
        }
    });

    stager.extendStep('end', {
        cb: function() {
            // Save data in the data/roomXXX directory.
            node.game.memory.save('data.json');
            console.log('Game end.');
        }
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
