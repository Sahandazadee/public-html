#include <stdio.h>

static void log_line(const char *msg)
{
    printf("[a] %s\n", msg);
}

void a_run(void)
{
    log_line("hello from a");
}
