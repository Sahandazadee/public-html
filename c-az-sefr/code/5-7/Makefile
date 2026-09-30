CC = gcc
ARMCC = arm-none-eabi-gcc
CFLAGS = -std=c11 -Wall -Wextra
ARMFLAGS = -mcpu=cortex-m4 -mthumb -std=gnu11 -Wall -Wextra -ffreestanding

.PHONY: all run clean

all: app led_arm.o

app: main.c led.c hal_gpio_mock.c
	$(CC) $(CFLAGS) -o $@ $^

led_arm.o: led.c led.h hal_gpio.h
	$(ARMCC) $(ARMFLAGS) -c -o $@ $<

run: app
	./app

clean:
	rm -f app *.o
