#include <stdint.h>

volatile uint32_t in_raw;
volatile uint32_t out_val;

int main(void)
{
    for (;;) {
#if defined(USE_DOUBLE)
        double t = (double)in_raw * 3.3 / 4095.0;
        out_val = (uint32_t)(t * 1000.0);
#elif defined(USE_FLOAT)
        float t = (float)in_raw * 3.3f / 4095.0f;
        out_val = (uint32_t)(t * 1000.0f);
#else
        out_val = in_raw * 3300u / 4095u;
#endif
    }
}
