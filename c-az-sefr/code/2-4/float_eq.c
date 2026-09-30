#include <stdio.h>

int main(void)
{
    double a = 0.1 + 0.2;
    double diff = a - 0.3;
    double epsilon = 0.000001;

    printf("a = %.17f\n", a);
    printf("a == 0.3 gives %d\n", a == 0.3);

    if (diff < 0) {
        diff = -diff;
    }
    printf("close enough gives %d\n", diff < epsilon);
    return 0;
}
