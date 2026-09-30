#include <stdio.h>

#define BUFFER_SIZE 64
#define AVG(a, b) (((a) + (b)) / 2)

static void motor_off(void) { printf("motor_off "); }
static void led_off(void) { printf("led_off\n"); }

#define STOP_MOTOR() do { motor_off(); led_off(); } while (0)

int main(void)
{
    int fault = 1;
    unsigned char buf[BUFFER_SIZE];

    printf("avg=%d\n", AVG(4, 8));
    if (fault)
        STOP_MOTOR();
    else
        printf("running\n");
    printf("buf=%zu\n", sizeof(buf));
    return 0;
}
