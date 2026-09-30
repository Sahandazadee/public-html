#include <stdint.h>

void systick_init_1ms(void);
uint32_t millis(void);
void pwm_init_1khz(void);
void pwm_set_permille(uint32_t permille);

int main(void)
{
    uint32_t last = 0u;
    int32_t level = 0;
    int32_t step = 10;

    systick_init_1ms();
    pwm_init_1khz();

    for (;;) {
        if (millis() - last >= 10u) {
            last += 10u;
            level += step;
            if (level >= 1000) {
                level = 1000;
                step = -step;
            } else if (level <= 0) {
                level = 0;
                step = -step;
            }
            pwm_set_permille((uint32_t)level);
        }
    }
}
