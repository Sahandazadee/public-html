#ifndef LED_H
#define LED_H

typedef struct led led_t;      /* نوع مات: فیلدها در led.c هستند */

led_t *led_get(unsigned index);
void led_on(led_t *led);
void led_off(led_t *led);
int led_is_on(const led_t *led);

#endif /* LED_H */
