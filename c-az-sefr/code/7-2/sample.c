#include <stdint.h>
#include <stdio.h>

struct sample_old { uint8_t id; uint16_t value; uint8_t flags; uint32_t time; };
struct sample_new { uint32_t time; uint16_t value; uint8_t id; uint8_t flags; };

int main(void)
{
    printf("old: %zu\n", sizeof(struct sample_old));
    printf("new: %zu\n", sizeof(struct sample_new));
    return 0;
}
