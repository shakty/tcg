/**
 * Canvas script for TCG
 * Copyright(c) 2020 arjsto <a.stolk8@gmail.com>
 */

window.onload = function () {
    // canvas, light grey backdrop
    var canvas = document.getElementById('mycanvas');
    canvas.width = parent.window.innerWidth;
    canvas.height = parent.window.innerHeight;
    canvas.focus();
    var c = canvas.getContext('2d');
    c.fillStyle = "rgba(178.5, 178.5, 178.5, 1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
};

 // FIXME: also change the header's background somewhere to match the frame's?