#include <stdio.h>

int main(void)
{
    int temp_c = 22;

    if (temp_c >= 35) {
        printf("very hot\n");
    } else if (temp_c >= 25) {
        printf("warm\n");
    } else if (temp_c >= 15) {
        printf("mild\n");
    } else {
        printf("cold\n");
    }
    return 0;
}
