#include <stdio.h>

#define LOG_ERROR 1
#define LOG_INFO  2
#define LOG_DEBUG 3

#ifndef LOG_LEVEL
#define LOG_LEVEL LOG_INFO      // سطح پیش‌فرض
#endif

#define LOG_AT(lvl, tag, ...)                                   \
    do {                                                        \
        if ((lvl) <= LOG_LEVEL) {                               \
            printf("[%s] %s:%d: ", (tag), __FILE__, __LINE__);  \
            printf(__VA_ARGS__);                                \
            printf("\n");                                       \
        }                                                       \
    } while (0)

#define LOGE(...) LOG_AT(LOG_ERROR, "E", __VA_ARGS__)
#define LOGI(...) LOG_AT(LOG_INFO,  "I", __VA_ARGS__)
#define LOGD(...) LOG_AT(LOG_DEBUG, "D", __VA_ARGS__)

int main(void)
{
    int temp = 42;
    LOGE("sensor timeout after %d ms", 500);
    LOGI("temp = %d", temp);
    LOGD("raw adc = %d", 1234);
    return 0;
}
