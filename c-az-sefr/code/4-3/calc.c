#include <stdio.h>

typedef int (*binop_t)(int, int);

static int add(int a, int b)    { return a + b; }
static int sub(int a, int b)    { return a - b; }
static int mul(int a, int b)    { return a * b; }
static int divide(int a, int b) { return b == 0 ? 0 : a / b; }

static binop_t find_op(char symbol)
{
    switch (symbol) {
    case '+': return add;
    case '-': return sub;
    case '*': return mul;
    case '/': return divide;
    default:  return NULL;
    }
}

int main(void)
{
    const char symbols[] = {'+', '-', '*', '/', '%'};

    for (int i = 0; i < 5; i++) {
        binop_t op = find_op(symbols[i]);
        if (op == NULL) {
            printf("8 %c 2 : unsupported\n", symbols[i]);
        } else {
            printf("8 %c 2 = %d\n", symbols[i], op(8, 2));
        }
    }
    return 0;
}
