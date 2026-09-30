#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint32_t last_a = 0, last_b = 0;
    printf("now   A(last=now)  B(last+=period)\n");
    for (uint32_t now = 0; now <= 3000; now += 7) {     // حلقهٔ اصلی هر ۷ms یک بار می‌چرخد
        int a = 0, b = 0;
        if (now - last_a >= 500u) { last_a = now;   a = 1; }
        if (now - last_b >= 500u) { last_b += 500u; b = 1; }
        if (a || b) {
            printf("%4u  %s          %s\n", (unsigned)now, a ? "fire" : "    ", b ? "fire" : "");
        }
    }
    return 0;
}
