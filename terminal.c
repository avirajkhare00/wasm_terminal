#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

#define TERM_WIDTH 80
#define TERM_HEIGHT 24
#define CHAR_WIDTH 10
#define CHAR_HEIGHT 20

// Terminal state
static char terminal_buffer[TERM_HEIGHT][TERM_WIDTH];
static int cursor_x = 0;
static int cursor_y = 0;

EMSCRIPTEN_KEEPALIVE
void init_terminal() {
    // Initialize terminal buffer with spaces
    for (int y = 0; y < TERM_HEIGHT; y++) {
        for (int x = 0; x < TERM_WIDTH; x++) {
            terminal_buffer[y][x] = ' ';
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void put_char(char c) {
    if (c == '\n') {
        cursor_x = 0;
        cursor_y++;
        if (cursor_y >= TERM_HEIGHT) {
            // Scroll up
            for (int y = 0; y < TERM_HEIGHT - 1; y++) {
                memcpy(terminal_buffer[y], terminal_buffer[y + 1], TERM_WIDTH);
            }
            // Clear last line
            memset(terminal_buffer[TERM_HEIGHT - 1], ' ', TERM_WIDTH);
            cursor_y = TERM_HEIGHT - 1;
        }
    } else {
        if (cursor_x >= TERM_WIDTH) {
            cursor_x = 0;
            cursor_y++;
            if (cursor_y >= TERM_HEIGHT) {
                // Scroll up
                for (int y = 0; y < TERM_HEIGHT - 1; y++) {
                    memcpy(terminal_buffer[y], terminal_buffer[y + 1], TERM_WIDTH);
                }
                // Clear last line
                memset(terminal_buffer[TERM_HEIGHT - 1], ' ', TERM_WIDTH);
                cursor_y = TERM_HEIGHT - 1;
            }
        }
        terminal_buffer[cursor_y][cursor_x] = c;
        cursor_x++;
    }
}

EMSCRIPTEN_KEEPALIVE
char* get_line(int y) {
    if (y >= 0 && y < TERM_HEIGHT) {
        return terminal_buffer[y];
    }
    return NULL;
}

EMSCRIPTEN_KEEPALIVE
int get_cursor_x() {
    return cursor_x;
}

EMSCRIPTEN_KEEPALIVE
int get_cursor_y() {
    return cursor_y;
}

EMSCRIPTEN_KEEPALIVE
void write_text(const char* text) {
    int len = strlen(text);
    for (int i = 0; i < len; i++) {
        put_char(text[i]);
    }
}
