/**
 * # Game stages definition file
 * Copyright(c) 2020 arjsto <a.stolk8@gmail.com>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

     stager
        .next('instructions')
        .repeat('tcg', settings.REPEAT)
        .next('end')
        .gameover()

        stager.extendStage('tcg', {
            steps: [
                'sender',
                'receiver'
            ]
        });

    // Modify the stager to skip one stage.
    stager.skip('instructions');

    // To skip a step within a stage use:
    // stager.skip('stageName', 'stepName');
    // Notice: here all stages have just one step.
};
