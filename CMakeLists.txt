cmake_minimum_required(VERSION 3.13)
project(wasm_terminal)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Ensure we're using Emscripten
if(NOT EMSCRIPTEN)
    message(FATAL_ERROR "This project must be compiled with Emscripten")
endif()

add_executable(terminal terminal.c)

# Set Emscripten link flags
set_target_properties(terminal PROPERTIES
    LINK_FLAGS "-s WASM=1 -s EXPORTED_RUNTIME_METHODS=['stringToNewUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=['_malloc','_free','_init_terminal','_put_char','_get_line','_get_cursor_x','_get_cursor_y','_write_text'] -s NO_EXIT_RUNTIME=1"
)
