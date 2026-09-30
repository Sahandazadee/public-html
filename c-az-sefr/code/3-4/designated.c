#include <stdint.h>
#include <stdio.h>

typedef struct {
    uint8_t id;
    int16_t temp_x10;               // دما ضرب در ۱۰
    uint8_t flags;
} reading_t;

int main(void)
{
    reading_t r = {.id = 3, .temp_x10 = 235};
    reading_t table[3] = {
        {.id = 1, .temp_x10 = 200},
        {.id = 2, .temp_x10 = 310},
        {.id = 3, .temp_x10 = 150},
    };
    int hottest = 0;

    printf("r: id=%u temp=%d flags=%u\n", (unsigned)r.id, (int)r.temp_x10, (unsigned)r.flags);
    for (int i = 1; i < 3; i++) {
        if (table[i].temp_x10 > table[hottest].temp_x10) {
            hottest = i;
        }
    }
    printf("hottest: id=%u temp=%d\n", (unsigned)table[hottest].id, (int)table[hottest].temp_x10);
    return 0;
}
