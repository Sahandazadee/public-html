#include <stdio.h>

#define SHOW(expr)  printf(#expr " = %d\n", (expr))
#define REG(name)   reg_##name

int reg_moder = 1;
int reg_odr = 32;

int main(void)
{
    int a = 6;
    int b = 7;
    SHOW(a * b);
    SHOW(a + b);
    printf("%d %d\n", REG(moder), REG(odr));
    printf("file=%s line=%d func=%s\n", __FILE__, __LINE__, __func__);
    printf("std=%ld\n", __STDC_VERSION__);
    return 0;
}
