#include <stdio.h>

#define SQUARE(x) x * x
#define SQUARE_OK(x) ((x) * (x))

static void state_name(int s)
{
    switch (s) {
    case 0:
        printf("[IDLE]");
    case 1:
        printf("[RUN]");
        break;
    default:
        printf("[?]");
    }
    printf("\n");
}

int main(void)
{
    int n = 3;
    printf("SQUARE(n + 1)    = %d\n", SQUARE(n + 1));
    printf("SQUARE_OK(n + 1) = %d\n", SQUARE_OK(n + 1));

    if (n > 5);                 // نقطه‌ویرگول اضافه: بدنهٔ if خالی است
        printf("n is big\n");

    state_name(0);              // break فراموش شده: از case 0 به case 1 می‌ریزد
    return 0;
}
