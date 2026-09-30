#include <stdint.h>
#include <stdio.h>

typedef void (*task_fn)(void);

typedef struct {
    const char *name;
    uint32_t period_ms;
    uint32_t last_ms;
    task_fn run;
} task_t;

static uint32_t g_now;                  // زمان شبیه‌سازی‌شده

static void task_led(void)    { printf("t=%4u  led toggle\n", (unsigned)g_now); }
static void task_button(void) { printf("t=%4u  scan button\n", (unsigned)g_now); }
static void task_report(void) { printf("t=%4u  send report\n", (unsigned)g_now); }

static task_t tasks[] = {
    { "led",    500u,  0u, task_led    },
    { "button", 250u,  0u, task_button },
    { "report", 1000u, 0u, task_report },
};

static void scheduler_run_once(uint32_t now)
{
    for (unsigned i = 0; i < sizeof tasks / sizeof tasks[0]; i++) {
        task_t *t = &tasks[i];
        if (now - t->last_ms >= t->period_ms) {
            t->last_ms += t->period_ms;
            t->run();
        }
    }
}

int main(void)
{
    for (g_now = 1; g_now <= 1000; g_now++) {
        scheduler_run_once(g_now);
    }
    return 0;
}
