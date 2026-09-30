#include <stdint.h>
#include <stdio.h>

static int bad_expired(uint32_t now, uint32_t start, uint32_t dur)
{
    return now >= start + dur;          // روش ناامن
}

static int good_expired(uint32_t now, uint32_t start, uint32_t dur)
{
    return (uint32_t)(now - start) >= dur;   // روش امن
}

int main(void)
{
    uint32_t start = 4294967200u;       // ۹۶ms مانده به چرخش شمارنده
    uint32_t dur = 200u;
    uint32_t elapsed[] = { 0u, 100u, 199u, 200u, 250u };

    printf("start+dur = %u (wrapped)\n", (unsigned)(start + dur));
    printf("elapsed  now         bad good\n");
    for (unsigned i = 0; i < sizeof elapsed / sizeof elapsed[0]; i++) {
        uint32_t now = start + elapsed[i];
        printf("%7u  %10u  %d   %d\n", (unsigned)elapsed[i], (unsigned)now,
               bad_expired(now, start, dur), good_expired(now, start, dur));
    }
    return 0;
}
