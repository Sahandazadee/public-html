#include <stdio.h>
#include <stdint.h>

#define LOG_SIZE 8u

typedef struct {
    uint32_t time_ms;
    int16_t  value;
} entry_t;

static entry_t entries[LOG_SIZE];
static unsigned next_slot = 0;
static unsigned count = 0;

static void log_add(uint32_t time_ms, int16_t value)
{
    entries[next_slot].time_ms = time_ms;
    entries[next_slot].value = value;
    next_slot = (next_slot + 1u) % LOG_SIZE;
    if (count < LOG_SIZE) {
        count++;
    }
}

int main(void)
{
    printf("entry = %zu bytes, total = %zu bytes\n", sizeof(entry_t), sizeof entries);

    for (int i = 0; i < 10; i++) {
        log_add((uint32_t)(i * 10), (int16_t)(100 + i));
    }

    unsigned start = (next_slot + LOG_SIZE - count) % LOG_SIZE;
    for (unsigned i = 0; i < count; i++) {
        printf("%d%s", entries[(start + i) % LOG_SIZE].value, i + 1 < count ? " " : "\n");
    }
    return 0;
}
