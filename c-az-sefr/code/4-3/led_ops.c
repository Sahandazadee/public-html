#include <stdio.h>

typedef struct {
    void (*init)(void);
    void (*set)(int on);
} led_ops_t;

static void console_init(void)  { printf("console: ready\n"); }
static void console_set(int on) { printf("console: LED %s\n", on ? "ON" : "OFF"); }

static void quiet_init(void)    { }
static void quiet_set(int on)   { (void)on; }

static const led_ops_t console_ops = { console_init, console_set };
static const led_ops_t quiet_ops   = { quiet_init,   quiet_set };

static void blink_twice(const led_ops_t *ops)
{
    ops->init();
    for (int i = 0; i < 2; i++) {
        ops->set(1);
        ops->set(0);
    }
}

int main(void)
{
    blink_twice(&console_ops);
    blink_twice(&quiet_ops);
    printf("done\n");
    return 0;
}
