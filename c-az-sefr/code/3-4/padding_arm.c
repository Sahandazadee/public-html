#include <stddef.h>
#include <stdint.h>

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

// اگر عددها درست نباشند، همین‌جا کامپایل می‌شکند
_Static_assert(sizeof(struct wasteful) == 12, "wasteful must be 12 bytes");
_Static_assert(offsetof(struct wasteful, b) == 4, "b at offset 4");
_Static_assert(sizeof(struct sorted) == 8, "sorted must be 8 bytes");
