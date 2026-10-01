CC      = arm-none-eabi-gcc
CFLAGS  = -mcpu=cortex-m4 -mthumb -std=gnu11 -Wall -Wextra -ffreestanding -Og
LDFLAGS = -nostdlib -T link.ld
BOOT    = startup.o vectors.o

all: spi_loop.bin

spi_loop.elf: spi_loop.o spi2.o uart.o $(BOOT) link.ld
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ spi_loop.o spi2.o uart.o $(BOOT)

%.bin: %.elf
	arm-none-eabi-objcopy -O binary $< $@

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

.PRECIOUS: %.o %.elf

clean:
	rm -f *.o *.elf *.bin
