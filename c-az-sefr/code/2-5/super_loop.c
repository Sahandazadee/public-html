#include <stdio.h>

int main(void)
{
    int round_no = 0;

    for (;;) {
        round_no = round_no + 1;
        printf("round %d: read inputs, update, write outputs\n", round_no);
        if (round_no == 3) {
            break;
        }
    }
    printf("stopped after %d rounds\n", round_no);
    return 0;
}
