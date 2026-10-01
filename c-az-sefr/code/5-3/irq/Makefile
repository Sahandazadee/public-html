CC      = arm-none-eabi-gcc
CFLAGS  = -mcpu=cortex-m4 -mthumb -std=gnu11 -Wall -Wextra -ffreestanding -Og
LDFLAGS = -nostdlib -T link.ld

all: button_irq.bin

button_irq.elf: main.o startup.o vectors.o link.ld
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ main.o startup.o vectors.o

button_irq.bin: button_irq.elf
	arm-none-eabi-objcopy -O binary $< $@

%.o: %.c board.h
	$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -f *.o *.elf *.bin
