#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>

#define STACK_MAX 4U

typedef struct {
    int16_t  item[STACK_MAX];
    uint8_t  top;               // تعداد عنصرهای موجود = ایندکس خانهٔ خالی بعدی
} lifo_t;

static bool lifo_push(lifo_t *s, int16_t v)
{
    if (s->top == STACK_MAX) {
        return false;
    }
    s->item[s->top] = v;
    s->top++;
    return true;
}

static bool lifo_pop(lifo_t *s, int16_t *out)
{
    if (s->top == 0U) {
        return false;
    }
    s->top--;
    *out = s->item[s->top];
    return true;
}

int main(void)
{
    lifo_t s = { .top = 0 };
    int16_t v;

    lifo_push(&s, 10);
    lifo_push(&s, 20);
    lifo_push(&s, 30);
    printf("pop order:");
    while (lifo_pop(&s, &v)) {
        printf(" %d", v);
    }
    printf("\n");
    return 0;
}
