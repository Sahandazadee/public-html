#include <stdio.h>

int main(void)
{
    int n = 255;
    unsigned int u = 3000000000U;
    double pi = 3.14159265;

    printf("%%d  : %d\n", n);
    printf("%%i  : %i\n", n);
    printf("%%u  : %u\n", u);
    printf("%%x  : %x\n", n);
    printf("%%X  : %X\n", n);
    printf("%%o  : %o\n", n);
    printf("%%#x : %#x\n", n);
    printf("%%c  : %c\n", 'Z');
    printf("%%s  : %s\n", "text");
    printf("%%f  : %f\n", pi);
    printf("%%e  : %e\n", pi);
    printf("%%g  : %g\n", pi);
    printf("%%%%  : 100%%\n");
    return 0;
}
