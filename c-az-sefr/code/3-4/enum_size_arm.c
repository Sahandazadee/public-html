typedef enum { STATE_IDLE, STATE_RUN, STATE_ERROR } state_t;

// روی arm-none-eabi-gcc (پیش‌فرض -fshort-enums) اندازه ۱ است
_Static_assert(sizeof(state_t) == 1, "short enum on arm-none-eabi");
