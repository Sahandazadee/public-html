#include <stdio.h>

typedef void (*button_cb_t)(int pin);

static button_cb_t on_press = NULL;     // در ابتدا هیچ‌کس ثبت‌نام نکرده

static void button_register(button_cb_t cb)
{
    on_press = cb;
}

static void button_event(int pin)
{
    if (on_press != NULL) {
        on_press(pin);
    } else {
        printf("no handler for pin %d\n", pin);
    }
}

static void my_handler(int pin)
{
    printf("pressed: pin %d\n", pin);
}

int main(void)
{
    button_event(13);
    button_register(my_handler);
    button_event(13);
    return 0;
}
