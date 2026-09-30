#include "minitest.h"
#include "button.h"

static button_t btn;
static unsigned presses;
static unsigned releases;

void setUp(void)
{
    button_init(&btn);
    presses = 0;
    releases = 0;
}

void tearDown(void) {}

/* کمکی: رشتهٔ '0'/'1' را tick به tick به دکمه می‌دهد و رویدادها را می‌شمارد */
static void feed(const char *pattern)
{
    for (unsigned i = 0; pattern[i] != '\0'; i++) {
        btn_event_t ev = button_step(&btn, pattern[i] == '1');
        if (ev == BTN_EV_PRESS) {
            presses++;
        } else if (ev == BTN_EV_RELEASE) {
            releases++;
        }
    }
}

static void test_starts_released_without_events(void)
{
    TEST_ASSERT_EQUAL_INT(BTN_RELEASED, btn.state);
    feed("0000");
    TEST_ASSERT_EQUAL_INT(0, presses + releases);
}

static void test_short_noise_is_ignored(void)
{
    feed("01010100");
    TEST_ASSERT_EQUAL_INT(0, presses);
    TEST_ASSERT_EQUAL_INT(BTN_RELEASED, btn.state);
}

static void test_press_needs_exactly_the_stable_count(void)
{
    for (unsigned i = 0; i < BTN_STABLE_TICKS - 1U; i++) {
        feed("1");
    }
    TEST_ASSERT_EQUAL_INT(0, presses);          // یکی کم است
    feed("1");
    TEST_ASSERT_EQUAL_INT(1, presses);          // همین‌جا معتبر شد
    TEST_ASSERT_EQUAL_INT(BTN_PRESSED, btn.state);
}

static void test_holding_does_not_repeat_the_event(void)
{
    feed("0");
    for (unsigned i = 0; i < 50; i++) {
        feed("1");
    }
    TEST_ASSERT_EQUAL_INT(1, presses);
    TEST_ASSERT_EQUAL_INT(0, releases);
}

static void test_bounce_while_pressed_is_not_a_release(void)
{
    feed("111");
    feed("0110");                                // پرش کوتاه وسط فشار
    TEST_ASSERT_EQUAL_INT(1, presses);
    TEST_ASSERT_EQUAL_INT(0, releases);
}

static void test_full_cycle_twice(void)
{
    feed("0111000");
    feed("0111000");
    TEST_ASSERT_EQUAL_INT(2, presses);
    TEST_ASSERT_EQUAL_INT(2, releases);
    TEST_ASSERT_EQUAL_INT(BTN_RELEASED, btn.state);
}

static void test_state_names_are_readable(void)
{
    TEST_ASSERT_EQUAL_STRING("RELEASED", button_state_name(BTN_RELEASED));
    TEST_ASSERT_EQUAL_STRING("PRESSED", button_state_name(BTN_PRESSED));
}

/* تست جدولی: هر سطر یک سناریو با نتیجهٔ مورد انتظار */
typedef struct {
    const char *pattern;
    unsigned    presses;
    unsigned    releases;
} scenario_t;

static void test_table_of_scenarios(void)
{
    static const scenario_t rows[] = {
        { "",            0, 0 },
        { "1",           0, 0 },
        { "111",         1, 0 },
        { "1101110",     1, 0 },
        { "111000",      1, 1 },
        { "11100100",    1, 0 },
        { "1110001110",  2, 1 },
    };
    for (unsigned r = 0; r < (sizeof(rows) / sizeof(rows[0])); r++) {
        char msg[64];
        setUp();
        feed(rows[r].pattern);
        if ((presses != rows[r].presses) || (releases != rows[r].releases)) {
            (void)snprintf(msg, sizeof(msg), "row %u \"%s\": presses=%u releases=%u",
                           r, rows[r].pattern, presses, releases);
            TEST_FAIL_MESSAGE(msg);
        }
    }
}

int main(void)
{
    TEST_BEGIN();
    RUN_TEST(test_starts_released_without_events);
    RUN_TEST(test_short_noise_is_ignored);
    RUN_TEST(test_press_needs_exactly_the_stable_count);
    RUN_TEST(test_holding_does_not_repeat_the_event);
    RUN_TEST(test_bounce_while_pressed_is_not_a_release);
    RUN_TEST(test_full_cycle_twice);
    RUN_TEST(test_state_names_are_readable);
    RUN_TEST(test_table_of_scenarios);
    return TEST_END();
}
