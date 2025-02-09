# WebAssembly Terminal

A simple terminal emulator implemented in C and compiled to WebAssembly, rendered in an HTML canvas.

## Prerequisites

- Emscripten SDK (emsdk)
- CMake (version 3.13 or higher)
- A modern web browser with WebAssembly support

## Building the Project

1. First, ensure you have activated the Emscripten environment:
   ```bash
   source /path/to/emsdk/emsdk_env.sh
   ```

2. Create a build directory and navigate to it:
   ```bash
   mkdir build
   cd build
   ```

3. Configure the project with CMake:
   ```bash
   emcmake cmake ..
   ```

4. Build the project:
   ```bash
   emmake make
   ```

5. The build process will generate:
   - `terminal.wasm`: The WebAssembly binary
   - `terminal.js`: The JavaScript glue code

6. Copy these files to your project root directory.

## Running the Terminal

You can serve the files using any HTTP server. For example, using Python:

```bash
python3 -m http.server 8000
```

Then open your browser and navigate to `http://localhost:8000`

## Features

- Basic terminal emulation
- Text input and display
- Cursor movement
- Scrolling support
- Classic green-on-black terminal styling

## Implementation Details

The terminal is implemented with the following components:

- `terminal.c`: Core terminal logic in C
- `terminal.js`: WebAssembly integration and canvas rendering
- `index.html`: HTML canvas container and styling
