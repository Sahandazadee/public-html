CC      = arm-none-eabi-gcc
CFLAGS  = -mcpu=cortex-m4 -mthumb -std=gnu11 -Wall -Wextra -ffreestanding -Og
LDFLAGS = -nostdlib -T link.ld
BOOT    = startup.o vectors.o

all: blink_ms.bin breathe.bin

blink_ms.elf: blink_ms.o systick.o $(BOOT) link.ld
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ blink_ms.o systick.o $(BOOT)

breathe.elf: breathe.o systick.o pwm_tim2.o $(BOOT) link.ld
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ breathe.o systick.o pwm_tim2.o $(BOOT)

%.bin: %.elf
	arm-none-eabi-objcopy -O binary $< $@

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

.PRECIOUS: %.o %.elf

clean:
	rm -f *.o *.elf *.bin
