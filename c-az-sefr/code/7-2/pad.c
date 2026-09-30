#include <stdio.h>
#include <stdint.h>

struct loose { uint8_t flag; uint32_t value; uint8_t mode; };
struct tight { uint32_t value; uint8_t flag; uint8_t mode; };

int main(void)
{
    printf("loose: %zu\n", sizeof(struct loose));
    printf("tight: %zu\n", sizeof(struct tight));
    return 0;
}
