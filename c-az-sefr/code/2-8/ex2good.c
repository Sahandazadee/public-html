#include <stdio.h>
#include <string.h>

int main(void)
{
    char cmd[] = "start";
    char name[8];
    strncpy(name, "Nasrin", sizeof(name) - 1);
    name[sizeof(name) - 1] = '\0';

    if (strcmp(cmd, "start") == 0) {
        printf("go, %s\n", name);
    }
    if (strcmp(cmd, "stop") != 0) {
        printf("not stop\n");
    }
    return 0;
}
