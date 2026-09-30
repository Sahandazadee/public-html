#include <stdio.h>
#include <stdint.h>

static const uint8_t sine_table[16] = {
    128, 176, 218, 245, 255, 245, 218, 176,
    128,  79,  37,  10,   0,  10,  37,  79
};

int main(void)
{
    unsigned phase = 0;

    for (int step = 0; step < 20; step++) {
        printf("%u ", (unsigned)sine_table[phase]);
        phase = (phase + 1) % 16;
    }
    printf("\n");
    printf("table size = %zu bytes\n", sizeof(sine_table));
    return 0;
}
