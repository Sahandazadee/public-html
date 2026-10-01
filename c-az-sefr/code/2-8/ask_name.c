#include <stdio.h>
#include <string.h>

int main(void)
{
    char name[16];

    printf("Your name? ");
    if (fgets(name, sizeof(name), stdin) == NULL) {
        return 1;
    }
    size_t n = strlen(name);
    if (n > 0 && name[n - 1] == '\n') {
        name[n - 1] = '\0';
    }
    printf("Hello, %s!\n", name);
    return 0;
}
