#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count = 5;
    int *values = malloc(count * sizeof *values);   // بگیر
    if (values == NULL) {                           // بررسی کن
        printf("out of memory\n");
        return 1;
    }

    for (int i = 0; i < count; i++) {
        values[i] = (i + 1) * 10;                   // استفاده کن
    }
    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum += values[i];
    }
    printf("sum = %d (used %zu bytes)\n", sum, count * sizeof *values);

    free(values);                                   // پس بده
    values = NULL;                                  // دیگر آویزان نیست
    return 0;
}
