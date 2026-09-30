#include <stdio.h>

static void show(const char *name, unsigned irq)
{
    printf("%-10s irq=%2u  ISER%u bit %2u @ 0x%08X  IPR @ 0x%08X  vector @ +0x%03X\n",
           name, irq, irq >> 5, irq & 31u,
           0xE000E100u + 4u * (irq >> 5), 0xE000E400u + irq, 4u * (16u + irq));
}

int main(void)
{
    show("EXTI0", 6);
    show("TIM2", 28);
    show("USART2", 38);
    show("EXTI15_10", 40);
    return 0;
}
