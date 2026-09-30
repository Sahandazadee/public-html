#include <stdio.h>

typedef struct {
    const char *name;
    int prio;
    int blocks;         // 1 = بعد از هر دور خودش را بلاک می‌کند (مثل vTaskDelay)
    int runs;
} task_t;

static task_t tasks[] = {
    { "hog",  3, 1, 0 },
    { "blink", 1, 1, 0 },
};

int main(void)
{
    for (int tick = 0; tick < 3; tick++) {
        int budget = 4;                     // سقف دور در هر تیک، تا شبیه‌سازی گیر نکند
        int blocked[2] = { 0, 0 };
        while (budget-- > 0) {
            int best = -1;
            for (int i = 0; i < 2; i++) {
                if (!blocked[i] && (best < 0 || tasks[i].prio > tasks[best].prio)) {
                    best = i;
                }
            }
            if (best < 0) {
                break;
            }
            tasks[best].runs++;
            if (tasks[best].blocks) {
                blocked[best] = 1;
            }
        }
    }
    for (int i = 0; i < 2; i++) {
        printf("%-6s prio=%d runs=%d\n", tasks[i].name, tasks[i].prio, tasks[i].runs);
    }
    return 0;
}
