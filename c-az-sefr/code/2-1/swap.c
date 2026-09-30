#include <stdio.h>

int main(void)
{
    int left = 10;
    int right = 20;
    int temp;

    printf("before: left = %d, right = %d\n", left, right);
    temp = left;        // ۱۰ را نجات بده
    left = right;       // حالا می‌شود ۲۰ را در left گذاشت
    right = temp;       // ۱۰ نجات‌یافته را در right بگذار
    printf("after:  left = %d, right = %d\n", left, right);
    return 0;
}
