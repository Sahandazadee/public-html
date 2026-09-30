CC      = arm-none-eabi-gcc
CFLAGS  = -mcpu=cortex-m4 -mthumb -std=gnu11 -Wall -Wextra -ffreestanding -Og
LDFLAGS = -nostdlib -T link.ld
PROGS   = blink button toggle

all: $(PROGS:=.bin)

%.elf: %.o startup.o link.ld
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $(filter %.o,$^)

%.bin: %.elf
	arm-none-eabi-objcopy -O binary $< $@

%.o: %.c stm32f4.h
	$(CC) $(CFLAGS) -c -o $@ $<

.PRECIOUS: %.o %.elf

clean:
	rm -f *.o *.elf *.bin
