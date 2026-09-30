#include <stdio.h>
#include <string.h>

int main(void)
{
    char name[8];
    strcpy(name, "temperature");     // 11 حرف + '\0' در 8 بایت جا نمی‌شود
    printf("%s\n", name);
    return 0;
}
