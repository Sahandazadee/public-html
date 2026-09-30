CC      = gcc
CFLAGS  = -std=c11 -Wall -Wextra -Wpedantic -Wshadow -Wconversion -O2

CORE    = logger.c parser.c ringbuf.c temp.c sim_sensor.c
HDRS    = config.h hal.h hal_host.h logger.h parser.h ringbuf.h sim_sensor.h temp.h

ARM_CC := $(shell command -v arm-none-eabi-gcc 2>/dev/null)
ARMFLAGS = -mcpu=cortex-m4 -mthumb -std=gnu11 -Wall -Wextra -Wconversion -Os \
           -ffreestanding -ffunction-sections -fdata-sections
ARMLINK  = -nostdlib -T link.ld -Wl,--gc-sections -Wl,-Map=tlog_stm32.map

ALL = check
ifneq ($(ARM_CC),)
ALL += stm32
endif

all: $(ALL)

tlog: main.c hal_host.c $(CORE) $(HDRS)
	$(CC) $(CFLAGS) -o $@ main.c hal_host.c $(CORE)

tlog_test: test_main.c $(CORE) $(HDRS)
	$(CC) $(CFLAGS) -o $@ test_main.c $(CORE)

check: tlog tlog_test
	./tlog_test
	./tlog > actual.txt
	diff expected.txt actual.txt

stm32: tlog_stm32.elf
	arm-none-eabi-size tlog_stm32.elf

tlog_stm32.elf: main_stm32.c hal_stm32.c startup.c link.ld $(CORE) $(HDRS) hal_stm32.h
	arm-none-eabi-gcc $(ARMFLAGS) $(ARMLINK) -o $@ main_stm32.c hal_stm32.c startup.c $(CORE)

clean:
	rm -f tlog tlog_test actual.txt tlog_stm32.elf tlog_stm32.map

.PHONY: all check stm32 clean
