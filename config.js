var Module = {
    preRun: [],
    postRun: [],
    print: function(text) {
        console.log(text);
        if (window.terminal && window.terminal.isInitialized) {
            window.terminal.writeToTerminal(text + '\n');
        }
    },
    printErr: function(text) {
        console.error(text);
        if (window.terminal && window.terminal.isInitialized) {
            window.terminal.writeToTerminal('Error: ' + text + '\n');
        }
    },
    canvas: (function() {
        var canvas = document.getElementById('terminal');
        return canvas;
    })()
};
