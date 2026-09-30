#ifndef TRAFFIC_H
#define TRAFFIC_H

typedef enum {
    S_GREEN,
    S_YELLOW,
    S_RED,
    S_COUNT             /* تعداد حالت‌ها؛ حالت واقعی نیست */
} light_state_t;

typedef enum {
    E_TIMEOUT,          /* زمان حالت فعلی تمام شد */
    E_PED_BUTTON,       /* عابر دکمه را زد */
    E_COUNT
} light_event_t;

typedef struct {
    light_state_t state;
    unsigned remaining; /* چند tick تا پایان این حالت */
} light_t;

void light_init(light_t *l);
void light_tick(light_t *l);                    /* یک tick زمان گذشت */
void light_dispatch(light_t *l, light_event_t ev);
const char *light_state_name(light_state_t s);

#endif /* TRAFFIC_H */
