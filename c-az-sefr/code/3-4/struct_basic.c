#include <stdio.h>

struct sensor {
    int id;
    int temp_c;
    int ok;
};

int main(void)
{
    struct sensor s1 = {1, 25, 1};
    struct sensor s2 = s1;          // کپی کل بسته
    s2.temp_c = 40;                 // فقط s2 عوض می‌شود

    printf("s1: id=%d temp=%d ok=%d\n", s1.id, s1.temp_c, s1.ok);
    printf("s2: id=%d temp=%d ok=%d\n", s2.id, s2.temp_c, s2.ok);
    printf("sizeof(struct sensor) = %zu\n", sizeof(struct sensor));
    return 0;
}
