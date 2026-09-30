#include <stdio.h>
#include <stdint.h>

#define SIZE 8U
#define MASK (SIZE - 1U)

int main(void)
{
    uint16_t head = 65533U;
    uint16_t tail = 65533U;

    for (int i = 0; i < 5; i++) {
        printf("put #%d: head=%5u slot=%u\n", i + 1, (unsigned)head, (unsigned)(head & MASK));
        head++;
    }
    printf("after 5 puts: head=%u tail=%u\n", (unsigned)head, (unsigned)tail);
    printf("head - tail as int      = %d\n", head - tail);
    printf("(uint16_t)(head - tail) = %u\n", (unsigned)(uint16_t)(head - tail));
    return 0;
}
