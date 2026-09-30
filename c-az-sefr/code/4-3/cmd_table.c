#include <stdio.h>
#include <string.h>

static void cmd_led_on(void)  { printf("LED is now ON\n"); }
static void cmd_led_off(void) { printf("LED is now OFF\n"); }
static void cmd_status(void)  { printf("status: all good\n"); }

typedef struct {
    const char *name;           // اسم فرمان
    void (*run)(void);          // تابعی که اجرایش می‌کند
} command_t;

static const command_t commands[] = {
    { "on",     cmd_led_on  },
    { "off",    cmd_led_off },
    { "status", cmd_status  },
};

#define COMMAND_COUNT (sizeof(commands) / sizeof(commands[0]))

static void dispatch(const char *word)
{
    for (size_t i = 0; i < COMMAND_COUNT; i++) {
        if (strcmp(word, commands[i].name) == 0) {
            commands[i].run();
            return;
        }
    }
    printf("unknown command: %s\n", word);
}

int main(void)
{
    const char *input[] = { "on", "status", "blink", "off" };

    for (size_t i = 0; i < sizeof(input) / sizeof(input[0]); i++) {
        dispatch(input[i]);
    }
    return 0;
}
