CC     = gcc
CFLAGS = -std=c11 -Wall -Wextra -Wpedantic
OBJS   = main.o bme.o mock_bus.o

all: sensor

sensor: $(OBJS)
	$(CC) $(OBJS) -o $@

%.o: %.c bus.h bme.h mock_bus.h
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) sensor

.PHONY: all clean
