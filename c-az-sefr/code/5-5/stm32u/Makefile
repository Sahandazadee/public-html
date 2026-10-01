CC      = arm-none-eabi-gcc
CFLAGS  = -mcpu=cortex-m4 -mthumb -std=gnu11 -Wall -Wextra -ffreestanding -Og
LDFLAGS = -nostdlib -T link.ld
BOOT    = startup.o vectors.o

all: uart_poll.bin uart_irq_echo.bin

uart_poll.elf: uart_main.o uart.o $(BOOT) link.ld
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ uart_main.o uart.o $(BOOT)

uart_irq_echo.elf: uart_irq_main.o uart.o uart_irq.o $(BOOT) link.ld
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ uart_irq_main.o uart.o uart_irq.o $(BOOT)

%.bin: %.elf
	arm-none-eabi-objcopy -O binary $< $@

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

.PRECIOUS: %.o %.elf

clean:
	rm -f *.o *.elf *.bin
