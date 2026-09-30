#include <stdio.h>
#include <stdbool.h>

static bool running = false;
static bool paused  = false;
static bool error   = false;

static void on_start(void)  { running = true; }
static void on_pause(void)  { paused = true; }
static void on_error(void)  { error = true; running = false; }
static void on_resume(void) { paused = false; running = true; }

static void show(const char *ev)
{
    printf("%-7s running=%d paused=%d error=%d\n", ev, running, paused, error);
}

int main(void)
{
    on_start();  show("start");
    on_pause();  show("pause");
    on_error();  show("error");
    on_resume(); show("resume");
    if (running && error) {
        printf("BUG: motor is running while in error!\n");
    }
    return 0;
}
