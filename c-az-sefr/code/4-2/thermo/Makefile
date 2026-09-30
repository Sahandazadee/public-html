CC      = gcc
CFLAGS  = -std=c11 -Wall -Wextra -Wpedantic -O1 -MMD -MP
TARGET  = thermo
SRCS    = main.c sensor.c filter.c
OBJS    = $(SRCS:.c=.o)
DEPS    = $(OBJS:.o=.d)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $@

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

-include $(DEPS)

clean:
	rm -f $(OBJS) $(DEPS) $(TARGET)

.PHONY: all clean
