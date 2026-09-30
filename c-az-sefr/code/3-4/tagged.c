#include <stdio.h>

typedef enum {
    VAL_INT,
    VAL_FLOAT
} val_kind_t;

typedef struct {
    val_kind_t kind;
    union {
        int i;
        float f;
    } as;
} value_t;

static void print_value(const value_t *v)
{
    if (v->kind == VAL_INT) {
        printf("int %d\n", v->as.i);
    } else {
        printf("float %.2f\n", (double)v->as.f);
    }
}

int main(void)
{
    value_t a = {.kind = VAL_INT, .as.i = 42};
    value_t b = {.kind = VAL_FLOAT, .as.f = 3.5f};
    print_value(&a);
    print_value(&b);
    printf("sizeof(value_t) = %zu\n", sizeof(value_t));
    return 0;
}
