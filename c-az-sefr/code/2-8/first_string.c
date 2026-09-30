#include <stdio.h>
#include <string.h>

int main(void)
{
    char name[] = "Ali";        // کامپایلر خودش '\0' را اضافه می‌کند
    char box[8] = "Hi";         // جا برای ۸ بایت؛ بقیه صفر می‌شود

    printf("name = %s\n", name);
    printf("sizeof(name) = %zu, strlen(name) = %zu\n", sizeof(name), strlen(name));
    printf("sizeof(box)  = %zu, strlen(box)  = %zu\n", sizeof(box), strlen(box));

    for (int i = 0; i < 8; i++) {
        printf("box[%d] = %d\n", i, box[i]);
    }
    return 0;
}
