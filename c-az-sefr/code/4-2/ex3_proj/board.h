#ifndef BOARD_H
#define BOARD_H

#ifndef BOARD
#define BOARD 1
#endif

#if BOARD == 1
#define BOARD_NAME "nucleo-f411re"
#define LED_PIN    5
#elif BOARD == 2
#define BOARD_NAME "esp32-devkit"
#define LED_PIN    2
#else
#error "Unknown BOARD"
#endif

#endif /* BOARD_H */
