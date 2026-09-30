#include <stdio.h>

int main(void)
{
    int values[6] = {42, 7, 19, 88, 3, 56};
    int count = sizeof(values) / sizeof(values[0]);
    int min = values[0];
    int max = values[0];
    int max_index = 0;

    for (int i = 1; i < count; i++) {
        if (values[i] < min) {
            min = values[i];
        }
        if (values[i] > max) {
            max = values[i];
            max_index = i;
        }
    }
    printf("min = %d, max = %d at index %d\n", min, max, max_index);
    return 0;
}
