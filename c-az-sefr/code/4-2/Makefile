CC      = gcc
BOARD  ?= 1
CFLAGS  = -std=c11 -Wall -Wextra -DBOARD=$(BOARD)
TARGET  = board_demo

all: $(TARGET)

$(TARGET): main.o
	$(CC) main.o -o $@

main.o: main.c board.h
	$(CC) $(CFLAGS) -c main.c -o $@

run: $(TARGET)
	./$(TARGET)

clean:
	rm -f main.o $(TARGET)

.PHONY: all run clean
