#include <stdio.h>

#define LOG(...)  printf("[debug] " __VA_ARGS__)

int main(void)
{
    int x = 7;
    LOG("x=%d\n", x);
    LOG("started\n");
    return 0;
}
