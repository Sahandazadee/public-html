#include <stdio.h>
#include "board.h"

int main(void)
{
    printf("board=%s led_pin=%d\n", BOARD_NAME, LED_PIN);
    return 0;
}
