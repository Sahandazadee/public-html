#include <stdint.h>
#include <stdio.h>

#define Q_LEN 4

typedef enum { REQ_DELAY, REQ_WAIT_Q, REQ_YIELD } req_kind_t;
typedef enum { T_READY, T_DELAYED, T_WAIT_Q } tstate_t;

typedef struct { req_kind_t kind; uint32_t ticks; } req_t;

typedef struct task task_t;
struct task {
    const char *name;
    uint8_t prio;                   // عدد بزرگ‌تر = اولویت بالاتر
    tstate_t state;
    uint32_t wake_at;
    req_t (*step)(void);            // یک دور از «حلقهٔ بی‌نهایت» task
};

static uint32_t g_tick;
static int q_buf[Q_LEN];
static unsigned q_head, q_count;

static req_t task_blink(void);
static req_t task_sensor(void);
static req_t task_logger(void);

static task_t tasks[] = {
    { "blink",  1u, T_READY, 0u, task_blink  },
    { "sensor", 2u, T_READY, 0u, task_sensor },
    { "logger", 3u, T_READY, 0u, task_logger },
    { NULL, 0u, T_READY, 0u, NULL }
};

static void wake_waiters(void)      // مثل بیدار شدن task منتظر صف
{
    for (unsigned i = 0; tasks[i].name != NULL; i++) {
        if (tasks[i].state == T_WAIT_Q) {
            tasks[i].state = T_READY;
        }
    }
}

static int q_put(int v)
{
    if (q_count == Q_LEN) {
        return 0;
    }
    q_buf[(q_head + q_count) % Q_LEN] = v;
    q_count++;
    wake_waiters();
    return 1;
}

static req_t task_blink(void)
{
    static int on;                  // حالت بین دورها می‌ماند
    on = !on;
    printf("t=%2u  blink   LED %s\n", (unsigned)g_tick, on ? "on" : "off");
    return (req_t){ REQ_DELAY, 5u };
}

static req_t task_sensor(void)
{
    static int value;
    value += 10;
    printf("t=%2u  sensor  put %d\n", (unsigned)g_tick, value);
    q_put(value);
    return (req_t){ REQ_DELAY, 4u };
}

static req_t task_logger(void)
{
    if (q_count == 0u) {
        return (req_t){ REQ_WAIT_Q, 0u };
    }
    int v = q_buf[q_head];
    q_head = (q_head + 1u) % Q_LEN;
    q_count--;
    printf("t=%2u  logger  got %d\n", (unsigned)g_tick, v);
    return (req_t){ REQ_YIELD, 0u };
}

static task_t *pick_next(void)
{
    task_t *best = NULL;
    for (unsigned i = 0; tasks[i].name != NULL; i++) {
        if (tasks[i].state == T_READY && (best == NULL || tasks[i].prio > best->prio)) {
            best = &tasks[i];
        }
    }
    return best;
}

int main(void)
{
    unsigned idle = 0;

    for (g_tick = 0; g_tick <= 12u; g_tick++) {
        for (unsigned i = 0; tasks[i].name != NULL; i++) {
            if (tasks[i].state == T_DELAYED && tasks[i].wake_at <= g_tick) {
                tasks[i].state = T_READY;
            }
        }
        if (g_tick == 6u) {
            printf("t=%2u  ISR     button -> queue\n", (unsigned)g_tick);
            q_put(99);
        }
        int ran = 0;
        for (task_t *t = pick_next(); t != NULL; t = pick_next()) {
            req_t r = t->step();
            ran = 1;
            if (r.kind == REQ_DELAY) {
                t->state = T_DELAYED;
                t->wake_at = g_tick + r.ticks;
            } else if (r.kind == REQ_WAIT_Q) {
                t->state = T_WAIT_Q;
            }
        }
        if (!ran) {
            idle++;
        }
    }
    printf("idle ticks: %u of 13\n", idle);
    return 0;
}
