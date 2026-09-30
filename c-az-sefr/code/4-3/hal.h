#ifndef HAL_H
#define HAL_H

void hal_button_callback(int pin);      // callback: کاربر می‌تواند جایگزین کند
void hal_irq(int pin);                  // از سخت‌افزار (ISR) صدا زده می‌شود

#endif
