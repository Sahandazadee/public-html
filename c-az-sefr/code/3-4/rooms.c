#include <stddef.h>
#include <stdio.h>

typedef struct {
    const char *name;
    int temp_c;
} room_t;

static const room_t *find_hottest(const room_t *rooms, size_t n)
{
    const room_t *best = &rooms[0];
    for (size_t i = 1; i < n; i++) {
        if (rooms[i].temp_c > best->temp_c) {
            best = &rooms[i];
        }
    }
    return best;
}

int main(void)
{
    const room_t rooms[] = {
        {"kitchen", 27},
        {"bedroom", 21},
        {"garage", 15},
        {"lab", 31},
    };
    size_t n = sizeof rooms / sizeof rooms[0];
    const room_t *hot = find_hottest(rooms, n);
    int sum = 0;

    for (size_t i = 0; i < n; i++) {
        sum += rooms[i].temp_c;
    }
    printf("hottest: %s (%d C)\n", hot->name, hot->temp_c);
    printf("average: %d C\n", sum / (int)n);
    return 0;
}
