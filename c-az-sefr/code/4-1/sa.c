#include <stdint.h>
#include <stdio.h>

struct packet {
    uint8_t  id;
    uint32_t value;
};

_Static_assert(sizeof(uint32_t) == 4, "uint32_t must be 4 bytes");
_Static_assert(sizeof(struct packet) == 5, "packet must be 5 bytes");

int main(void)
{
    printf("ok\n");
    return 0;
}
