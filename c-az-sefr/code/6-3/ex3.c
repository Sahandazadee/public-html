#include <stdint.h>
#include <stdio.h>

#define TXE_BIT     (1U << 7)
#define WAIT_LIMIT  1000U

typedef enum { TX_OK = 0, TX_TIMEOUT } tx_status_t;

static volatile uint32_t fake_sr;       // ثبات ساختگی (روی MCU: آدرس واقعی)

static tx_status_t wait_txe(volatile uint32_t *sr, uint32_t limit)
{
    for (uint32_t n = 0U; n < limit; n++) {
        if ((*sr & TXE_BIT) != 0U) {
            return TX_OK;
        }
    }
    return TX_TIMEOUT;
}

static const char *name(tx_status_t s)
{
    return (s == TX_OK) ? "TX_OK" : "TX_TIMEOUT";
}

int main(void)
{
    fake_sr = 0U;
    printf("sr=0x%02X -> %s\n", (unsigned)fake_sr, name(wait_txe(&fake_sr, WAIT_LIMIT)));
    fake_sr = TXE_BIT;
    printf("sr=0x%02X -> %s\n", (unsigned)fake_sr, name(wait_txe(&fake_sr, WAIT_LIMIT)));
    return 0;
}
