let Module = {
    onRuntimeInitialized: function() {
        initTerminal();
    }
};

const CHAR_WIDTH = 10;
const CHAR_HEIGHT = 20;
const TERM_WIDTH = 80;
const TERM_HEIGHT = 24;

let canvas, ctx;

function initTerminal() {
    canvas = document.getElementById('terminal');
    ctx = canvas.getContext('2d');
    
    // Set up canvas for terminal rendering
    ctx.font = `${CHAR_HEIGHT}px monospace`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#00ff00'; // Classic green terminal text
    
    // Initialize the terminal buffer in WebAssembly
    Module._init_terminal();
    
    // Write some initial text
    writeToTerminal("WebAssembly Terminal v1.0\n> ");
    
    // Set up keyboard input
    document.addEventListener('keypress', handleKeyPress);
    
    // Start the render loop
    requestAnimationFrame(render);
}

function writeToTerminal(text) {
    const textPtr = Module.stringToNewUTF8(text);
    Module._write_text(textPtr);
    Module._free(textPtr);
}

function handleKeyPress(event) {
    const char = String.fromCharCode(event.charCode);
    writeToTerminal(char);
    if (event.key === 'Enter') {
        writeToTerminal('\n> ');
    }
}

function render() {
    // Clear the canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00';
    
    // Render each line
    for (let y = 0; y < TERM_HEIGHT; y++) {
        const linePtr = Module._get_line(y);
        if (linePtr) {
            const line = Module.UTF8ToString(linePtr, TERM_WIDTH);
            for (let x = 0; x < TERM_WIDTH; x++) {
                ctx.fillText(
                    line[x],
                    x * CHAR_WIDTH,
                    y * CHAR_HEIGHT
                );
            }
        }
    }
    
    // Draw cursor
    const cursorX = Module._get_cursor_x();
    const cursorY = Module._get_cursor_y();
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(
        cursorX * CHAR_WIDTH,
        cursorY * CHAR_HEIGHT,
        CHAR_WIDTH,
        2
    );
    
    requestAnimationFrame(render);
}
