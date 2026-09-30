CC     = gcc
WARN   = -Wall -Wextra -Wconversion -Wshadow -Wstrict-prototypes -Werror
CFLAGS = -std=c11 $(WARN) -O0 -g --coverage -fsanitize=address,undefined
BUILD  = build

SRCS  := $(filter-out test_%.c,$(wildcard *.c))
OBJS  := $(SRCS:%.c=$(BUILD)/%.o)
TESTS := $(patsubst test_%.c,$(BUILD)/test_%,$(wildcard test_*.c))

all: test coverage

$(BUILD):
	mkdir -p $(BUILD)

$(BUILD)/%.o: %.c $(wildcard *.h) | $(BUILD)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD)/libsrc.a: $(OBJS)
	ar rcs $@ $^

$(BUILD)/test_%: test_%.c $(BUILD)/libsrc.a $(wildcard *.h)
	$(CC) $(CFLAGS) $< -L$(BUILD) -lsrc -o $@

test: $(TESTS)
	@fail=0; for t in $(TESTS); do echo "=== $$t"; ./$$t || fail=1; done; exit $$fail

coverage: test
	@echo "=== coverage"
	@gcov -n -o $(BUILD) $(SRCS)

clean:
	rm -rf $(BUILD) *.gcov

.PHONY: all test coverage clean
