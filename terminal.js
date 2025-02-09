class Terminal {
    constructor() {
        this.CHAR_WIDTH = 10;
        this.CHAR_HEIGHT = 20;
        this.TERM_WIDTH = 80;
        this.TERM_HEIGHT = 24;
        this.isInitialized = false;
        this.canvas = null;
        this.ctx = null;
        
        // Bind methods to this instance
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.render = this.render.bind(this);
        
        // Wait for Emscripten to be ready
        if (Module.ready) {
            this.init();
        } else {
            Module.onRuntimeInitialized = () => {
                console.log('WebAssembly Runtime Initialized');
                this.init();
            };
        }
    }
    
    init() {
        // Hide loading message
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
        
        this.canvas = document.getElementById('terminal');
        this.ctx = this.canvas.getContext('2d');
        
        // Set up canvas for terminal rendering
        this.ctx.font = `${this.CHAR_HEIGHT}px monospace`;
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = '#00ff00'; // Classic green terminal text
        
        // Initialize the terminal buffer in WebAssembly
        Module._init_terminal();
        this.isInitialized = true;
        
        // Write some initial text
        this.writeToTerminal('WebAssembly Terminal v1.0\n');
        this.writeToTerminal('Ready...\n> ');
        
        // Set up keyboard input
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keypress', this.handleKeyPress);
        
        // Start the render loop
        requestAnimationFrame(this.render);
    }
    
    writeToTerminal(text) {
        if (!this.isInitialized) return;
        
        try {
            const textPtr = Module.stringToNewUTF8(text);
            Module._write_text(textPtr);
            Module._free(textPtr);
        } catch (e) {
            console.error('Error writing to terminal:', e);
        }
    }
    
    handleKeyDown(event) {
        // Handle special keys
        switch (event.key) {
            case 'Backspace':
                event.preventDefault();
                // TODO: Implement backspace
                break;
            case 'Tab':
                event.preventDefault();
                this.writeToTerminal('    '); // 4 spaces
                break;
        }
    }
    
    handleKeyPress(event) {
        event.preventDefault();
        const char = String.fromCharCode(event.charCode);
        this.writeToTerminal(char);
        if (event.key === 'Enter') {
            this.writeToTerminal('\n> ');
        }
    }
    
    render() {
        if (!this.isInitialized) {
            requestAnimationFrame(this.render);
            return;
        }
    
        try {
            // Clear the canvas
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#00ff00';
            
            // Render each line
            for (let y = 0; y < this.TERM_HEIGHT; y++) {
                const linePtr = Module._get_line(y);
                if (linePtr) {
                    const line = Module.UTF8ToString(linePtr, this.TERM_WIDTH);
                    for (let x = 0; x < this.TERM_WIDTH; x++) {
                        if (line[x] && line[x] !== ' ') {
                            this.ctx.fillText(
                                line[x],
                                x * this.CHAR_WIDTH,
                                y * this.CHAR_HEIGHT
                            );
                        }
                    }
                }
            }
            
            // Draw cursor
            const cursorX = Module._get_cursor_x();
            const cursorY = Module._get_cursor_y();
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(
                cursorX * this.CHAR_WIDTH,
                cursorY * this.CHAR_HEIGHT,
                this.CHAR_WIDTH,
                2
            );
        } catch (e) {
            console.error('Render error:', e);
        }
        
        requestAnimationFrame(this.render);
    }
}

// Initialize terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
});

