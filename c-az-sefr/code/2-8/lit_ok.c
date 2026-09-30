#include <stdio.h>

int main(void)
{
    char copy[] = "hello";      // آرایه: یک کپی در RAM
    copy[0] = 'H';              // تغییر کپی مجاز است
    printf("%s\n", copy);
    return 0;
}
