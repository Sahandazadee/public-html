#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

struct wasteful {
    uint8_t a;
    uint32_t b;
    uint8_t c;
};

struct sorted {
    uint32_t b;
    uint8_t a;
    uint8_t c;
};

struct __attribute__((packed)) tight {
    uint8_t a;
    uint32_t b;
    uint8_t c;
};

int main(void)
{
    printf("wasteful: size=%zu, offset of b=%zu, offset of c=%zu\n",
           sizeof(struct wasteful), offsetof(struct wasteful, b), offsetof(struct wasteful, c));
    printf("sorted:   size=%zu\n", sizeof(struct sorted));
    printf("tight:    size=%zu, offset of b=%zu\n", sizeof(struct tight), offsetof(struct tight, b));
    return 0;
}
