#include <stdio.h>
#include <string.h>

int main(void)
{
    char cmd[] = "start";
    char name[8];

    strcpy(name, "Nasrin Moradi");
    if (cmd == "start") {
        printf("go, %s\n", name);
    }
    if (strcmp(cmd, "stop")) {
        printf("cmd is stop\n");
    }
    return 0;
}
