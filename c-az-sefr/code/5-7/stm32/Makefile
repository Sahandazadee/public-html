CC      = arm-none-eabi-gcc
CFLAGS  = -mcpu=cortex-m4 -mthumb -std=gnu11 -Wall -Wextra -ffreestanding -Og
LDFLAGS = -nostdlib -T link.ld
OBJS    = main_board.o led.o hal_gpio_stm32.o startup.o vectors.o

all: board.bin

board.elf: $(OBJS) link.ld
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $(OBJS)

board.bin: board.elf
	arm-none-eabi-objcopy -O binary $< $@

%.o: %.c hal_gpio.h led.h hal_gpio_stm32.h
	$(CC) $(CFLAGS) -c -o $@ $<

.PRECIOUS: %.o %.elf

clean:
	rm -f *.o *.elf *.bin
