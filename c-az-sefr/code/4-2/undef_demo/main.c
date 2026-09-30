#include <stdio.h>
#include "sensor.h"

int main(void)
{
    printf("%d\n", sensor_read_dc());
    return 0;
}
