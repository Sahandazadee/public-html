#include <stdint.h>
#include <stdio.h>

static void print_frame(uint8_t byte)
{
    printf("0x%02X: start=0 data=", byte);
    for (int i = 0; i < 8; i++) {
        printf("%d", (byte >> i) & 1);      // اول کم‌ارزش‌ترین بیت
    }
    printf(" stop=1\n");
}

int main(void)
{
    uint32_t baud = 115200u;
    uint32_t cpu_hz = 16000000u;

    print_frame('A');
    print_frame(0x55);

    printf("1 bit   = %u.%02u us\n", (unsigned)(1000000u / baud),
           (unsigned)(100000000u / baud % 100u));
    printf("1 frame = 10 bits, %u bytes/s\n", (unsigned)(baud / 10u));
    printf("CPU cycles per byte at 16 MHz = %u\n", (unsigned)(cpu_hz * 10u / baud));
    return 0;
}
