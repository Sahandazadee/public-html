#include <stdio.h>

#define UNITS 16                    // ۱۶ واحد

static char owner[UNITS];           // '.' یعنی آزاد؛ حرف یعنی مال کدام بلوک

static void show(const char *label)
{
    printf("%-12s |%.*s|\n", label, UNITS, owner);
}

// اولین جای خالیِ پشت‌سرهمِ به طول n را پیدا کن؛ نبود: -1
static int toy_alloc(int n, char id)
{
    for (int start = 0; start + n <= UNITS; start++) {
        int ok = 1;
        for (int i = 0; i < n; i++) {
            if (owner[start + i] != '.') {
                ok = 0;
                break;
            }
        }
        if (ok) {
            for (int i = 0; i < n; i++) {
                owner[start + i] = id;
            }
            return start;
        }
    }
    return -1;
}

static void toy_free(char id)
{
    for (int i = 0; i < UNITS; i++) {
        if (owner[i] == id) {
            owner[i] = '.';
        }
    }
}

static int free_total(void)
{
    int n = 0;
    for (int i = 0; i < UNITS; i++) {
        n += (owner[i] == '.');
    }
    return n;
}

int main(void)
{
    for (int i = 0; i < UNITS; i++) {
        owner[i] = '.';
    }

    toy_alloc(3, 'A');
    toy_alloc(3, 'B');
    toy_alloc(3, 'C');
    toy_alloc(3, 'D');
    toy_alloc(3, 'E');
    show("5 allocs");

    toy_free('B');
    toy_free('D');
    show("free B, D");
    printf("free units: %d\n", free_total());

    int r = toy_alloc(5, 'F');
    printf("alloc 5 units: %s\n", r < 0 ? "FAILED" : "ok");
    return 0;
}
