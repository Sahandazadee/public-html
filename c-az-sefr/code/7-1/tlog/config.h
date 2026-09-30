#ifndef CONFIG_H
#define CONFIG_H

#include <stdint.h>

typedef int16_t centi_t;                /* دما بر حسب صدم درجه: 2345 یعنی 23.45 C */

#define SAMPLE_PERIOD_MS  1000u         /* هر چند میلی‌ثانیه یک نمونه */
#define RING_CAPACITY     16u           /* تعداد نمونه‌های نگه‌داشته‌شده (توان ۲) */
#define ALARM_HIGH_CENTI  3000          /* آستانهٔ پیش‌فرض آلارم: 30.00 C */
#define ALARM_HYST_CENTI  200           /* پسماند: آلارم تا 2.00 C پایین‌تر روشن می‌ماند */
#define CMD_LINE_MAX      24u           /* بیشینهٔ طول یک خط فرمان */

#define ADC_MAX           4095u         /* سنسور ۱۲ بیتی */
#define TEMP_MIN_CENTI    (-4000)       /* -40.00 C به ازای raw = 0 */
#define TEMP_MAX_CENTI    12500         /* +125.00 C به ازای raw = 4095 */

#endif /* CONFIG_H */
