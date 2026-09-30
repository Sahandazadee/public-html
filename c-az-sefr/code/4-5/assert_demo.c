#define RB_SIZE 6U
#define RB_MASK (RB_SIZE - 1U)

_Static_assert((RB_SIZE & RB_MASK) == 0U, "RB_SIZE must be a power of two");

int main(void)
{
    return 0;
}
