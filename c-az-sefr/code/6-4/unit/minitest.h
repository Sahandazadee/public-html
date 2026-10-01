#ifndef MINITEST_H
#define MINITEST_H

#include <setjmp.h>
#include <stdarg.h>
#include <stdio.h>
#include <string.h>

/* فریم‌ورک کوچک به سبک Unity. هر فایل test_*.c یک برنامهٔ مستقل است. */
typedef struct {
    const char *name;       /* تست جاری */
    unsigned    run;        /* چند تست اجرا شد */
    unsigned    failed;     /* چند تست رد شد */
    int         failed_now; /* تست جاری رد شده؟ */
    jmp_buf     env;        /* نقطهٔ بازگشت بعد از شکست */
} mt_state_t;

static mt_state_t mt;

void setUp(void);           /* تست‌نویس تعریفشان می‌کند (مثل Unity) */
void tearDown(void);

static inline _Noreturn void mt_fail(const char *file, int line, const char *fmt, ...)
{
    va_list ap;
    printf("%s:%d:%s:FAIL: ", file, line, mt.name);
    va_start(ap, fmt);
    vprintf(fmt, ap);
    va_end(ap);
    printf("\n");
    mt.failed_now = 1;
    longjmp(mt.env, 1);     /* بقیهٔ همین تست اجرا نمی‌شود */
}

static inline void mt_run(const char *file, int line, const char *name, void (*fn)(void))
{
    mt.name = name;
    mt.run++;
    mt.failed_now = 0;
    if (setjmp(mt.env) == 0) {
        setUp();
        fn();
    }
    tearDown();
    if (mt.failed_now) {
        mt.failed++;
    } else {
        printf("%s:%d:%s:PASS\n", file, line, name);
    }
}

static inline int mt_end(void)
{
    printf("-----------------------\n%u Tests %u Failures\n%s\n",
           mt.run, mt.failed, (mt.failed == 0U) ? "OK" : "FAIL");
    return (mt.failed == 0U) ? 0 : 1;
}

#define TEST_BEGIN()   ((void)0)
#define RUN_TEST(fn)   mt_run(__FILE__, __LINE__, #fn, (fn))
#define TEST_END()     mt_end()

#define TEST_ASSERT_TRUE(c) \
    do { if (!(c)) { mt_fail(__FILE__, __LINE__, "Expected TRUE: %s", #c); } } while (0)
#define TEST_ASSERT_FALSE(c) \
    do { if (c) { mt_fail(__FILE__, __LINE__, "Expected FALSE: %s", #c); } } while (0)
#define TEST_ASSERT_NULL(p) \
    do { if ((p) != NULL) { mt_fail(__FILE__, __LINE__, "Expected NULL: %s", #p); } } while (0)
#define TEST_ASSERT_NOT_NULL(p) \
    do { if ((p) == NULL) { mt_fail(__FILE__, __LINE__, "Expected not NULL: %s", #p); } } while (0)

#define TEST_ASSERT_EQUAL_INT(exp, act) \
    do { long long e_ = (long long)(exp), a_ = (long long)(act); \
         if (e_ != a_) { mt_fail(__FILE__, __LINE__, "Expected %lld Was %lld", e_, a_); } } while (0)
#define TEST_ASSERT_EQUAL_HEX(exp, act) \
    do { unsigned long long e_ = (unsigned long long)(exp), a_ = (unsigned long long)(act); \
         if (e_ != a_) { mt_fail(__FILE__, __LINE__, "Expected 0x%llX Was 0x%llX", e_, a_); } } while (0)
#define TEST_ASSERT_EQUAL_STRING(exp, act) \
    do { const char *e_ = (exp), *a_ = (act); \
         if (strcmp(e_, a_) != 0) { mt_fail(__FILE__, __LINE__, "Expected \"%s\" Was \"%s\"", e_, a_); } } while (0)
#define TEST_ASSERT_EQUAL_MEMORY(exp, act, n) \
    do { if (memcmp((exp), (act), (n)) != 0) { mt_fail(__FILE__, __LINE__, "Memory differs (%s)", #act); } } while (0)
#define TEST_FAIL_MESSAGE(msg) mt_fail(__FILE__, __LINE__, "%s", (msg))

#endif /* MINITEST_H */
