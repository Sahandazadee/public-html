#include <stdio.h>
#include <stdint.h>

#define RX_SIZE 4

int main(void)
{
    uint8_t rx_buf[RX_SIZE] = {0};
    int rx_count = 0;
    const uint8_t incoming[6] = {'H', 'E', 'L', 'L', 'O', '!'};

    for (int i = 0; i < 6; i++) {
        if (rx_count < RX_SIZE) {
            rx_buf[rx_count] = incoming[i];
            rx_count++;
        } else {
            printf("buffer full, dropped '%c'\n", incoming[i]);
        }
    }
    printf("stored %d bytes:", rx_count);
    for (int i = 0; i < rx_count; i++) {
        printf(" %c", rx_buf[i]);
    }
    printf("\n");
    return 0;
}
