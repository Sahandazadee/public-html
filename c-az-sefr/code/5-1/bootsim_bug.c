#include <stdio.h>
#include <stdint.h>

/* «تراشهٔ اسباب‌بازی»: آرایه‌ها نقش Flash و RAM را بازی می‌کنند */
static const uint32_t flash_image[3] = { 5, 7, 9 };   /* مقدارهای اولیهٔ .data */
static uint32_t ram[8];      /* کلمهٔ 0..2: .data ، 3..5: .bss ، 6..7: آزاد */

static void dump(const char *title)
{
    printf("%-12s", title);
    for (int i = 0; i < 8; i++) {
        printf(" %08lX", (unsigned long)ram[i]);
    }
    printf("\n");
}

int main(void)
{
    uint32_t *sdata = &ram[0];
    uint32_t *edata = &ram[3];
    uint32_t *sbss  = &ram[3];
    uint32_t *ebss  = &ram[6];

    printf(".data = %ld words, .bss = %ld words\n",
           (long)(edata - sdata), (long)(ebss - sbss));

    for (int i = 0; i < 8; i++) {
        ram[i] = 0xDEADBEEFu;               /* برق وصل شد: آشغال */
    }
    dump("power on:");

    const uint32_t *src = flash_image;
    uint32_t *dst = sdata;
    while (dst < edata) {
        *dst++ = *src;                      /* کپی .data */
    }
    dump("after copy:");

    for (dst = sbss; dst < edata; dst++) {
        *dst = 0;                           /* صفر کردن .bss */
    }
    dump("after zero:");
    return 0;
}
