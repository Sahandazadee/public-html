#include <stdio.h>

int main(void)
{
    int led = 0;

    for (int step = 0; step < 6; step++) {
        led = !led;
        if (led) {
            printf("LED ON\n");
        } else {
            printf("LED OFF\n");
        }
    }

    int checks = 0;
    int button_level = 1;

    while (checks < 10 && button_level != 0) {
        checks = checks + 1;
        if (checks >= 4) {
            button_level = 0;
        }
    }

    if (button_level == 0) {
        printf("pressed after %d checks\n", checks);
    } else {
        printf("timeout\n");
    }
    return 0;
}
