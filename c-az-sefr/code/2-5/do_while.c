#include <stdio.h>

int main(void)
{
    int tries = 0;
    int reading;

    do {
        tries = tries + 1;
        reading = tries * 10;
        printf("try %d: reading = %d\n", tries, reading);
    } while (reading < 25);

    while (reading < 25) {
        printf("this line is never printed\n");
    }
    return 0;
}
