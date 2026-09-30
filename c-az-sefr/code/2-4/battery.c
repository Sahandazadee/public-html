#include <stdio.h>

int main(void)
{
    int battery_mv = 3600;

    if (battery_mv >= 4000) {
        printf("battery: FULL\n");
    } else if (battery_mv >= 3600) {
        printf("battery: OK\n");
    } else if (battery_mv >= 3300) {
        printf("battery: LOW\n");
    } else {
        printf("battery: EMPTY\n");
    }
    return 0;
}
