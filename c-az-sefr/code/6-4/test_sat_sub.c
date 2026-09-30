#include "minitest.h"
#include "sat_sub.h"

void setUp(void) {}
void tearDown(void) {}

static void test_normal_subtraction(void)
{
    TEST_ASSERT_EQUAL_INT(70, sat_sub_u8(100, 30));
}

static void test_subtracting_zero_changes_nothing(void)
{
    TEST_ASSERT_EQUAL_INT(255, sat_sub_u8(255, 0));
}

static void test_equal_operands_give_zero(void)
{
    TEST_ASSERT_EQUAL_INT(0, sat_sub_u8(50, 50));
}

static void test_negative_result_saturates_at_zero(void)
{
    TEST_ASSERT_EQUAL_INT(0, sat_sub_u8(10, 20));
    TEST_ASSERT_EQUAL_INT(0, sat_sub_u8(0, 255));
}

int main(void)
{
    TEST_BEGIN();
    RUN_TEST(test_normal_subtraction);
    RUN_TEST(test_subtracting_zero_changes_nothing);
    RUN_TEST(test_equal_operands_give_zero);
    RUN_TEST(test_negative_result_saturates_at_zero);
    return TEST_END();
}
