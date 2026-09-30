#include <stdio.h>
#include <stdint.h>

#define N 4

static uint8_t data[N];
static unsigned head = 0;   // جای نوشتن بعدی
static unsigned tail = 0;   // جای خواندن بعدی

static void put(uint8_t b)
{
    data[head] = b;
    head = (head + 1) % N;
}

int main(void)
{
    printf("start:  head=%u tail=%u\n", head, tail);
    for (uint8_t b = 'A'; b < 'A' + N; b++) {
        put(b);
    }
    printf("after %d puts: head=%u tail=%u\n", N, head, tail);
    if (head == tail) {
        printf("rule head==tail says: EMPTY (but %d bytes are inside!)\n", N);
    }
    return 0;
}
