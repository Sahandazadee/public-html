#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t capacity = 2;
    size_t length = 0;
    int *items = malloc(capacity * sizeof *items);
    if (items == NULL) {
        return 1;
    }

    for (int v = 1; v <= 5; v++) {
        if (length == capacity) {                   // پر شد؛ دو برابر کن
            size_t new_capacity = capacity * 2;
            int *bigger = realloc(items, new_capacity * sizeof *bigger);
            if (bigger == NULL) {
                free(items);                        // قدیمی هنوز سالم است
                return 1;
            }
            items = bigger;
            capacity = new_capacity;
            printf("grew to %zu\n", capacity);
        }
        items[length] = v * v;
        length++;
    }

    printf("items:");
    for (size_t i = 0; i < length; i++) {
        printf(" %d", items[i]);
    }
    printf("\nlength=%zu capacity=%zu\n", length, capacity);

    free(items);
    return 0;
}
