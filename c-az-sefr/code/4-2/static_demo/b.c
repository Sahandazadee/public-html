#include <stdio.h>

static void log_line(const char *msg)
{
    printf("[b] %s\n", msg);
}

void b_run(void)
{
    log_line("hello from b");
}
