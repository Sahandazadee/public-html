#include <stdio.h>
#include <stdint.h>
#include <stddef.h>

#define BLOCK_COUNT 4

typedef struct {
    uint16_t id;
    int16_t  value;
} packet_t;

static packet_t storage[BLOCK_COUNT];       // همهٔ بلوک‌ها از قبل در RAM هستند
static packet_t *free_list[BLOCK_COUNT];    // آدرس بلوک‌های آزاد
static int free_count;

static void pool_init(void)
{
    for (int i = 0; i < BLOCK_COUNT; i++) {
        free_list[i] = &storage[BLOCK_COUNT - 1 - i];
    }
    free_count = BLOCK_COUNT;
}

static packet_t *pool_alloc(void)
{
    if (free_count == 0) {
        return NULL;                        // پر است؛ تصمیمش با صدا زننده
    }
    free_count--;
    return free_list[free_count];
}

static void pool_free(packet_t *p)
{
    if (p == NULL) {
        return;
    }
    free_list[free_count] = p;
    free_count++;
}

static int index_of(const packet_t *p)
{
    return (int)(p - storage);
}

int main(void)
{
    pool_init();

    packet_t *a = pool_alloc();
    packet_t *b = pool_alloc();
    packet_t *c = pool_alloc();
    packet_t *d = pool_alloc();
    packet_t *e = pool_alloc();
    printf("a=%d b=%d c=%d d=%d e=%s\n", index_of(a), index_of(b), index_of(c), index_of(d), e == NULL ? "NULL" : "?");

    pool_free(b);
    packet_t *f = pool_alloc();
    printf("after free(b): f=%d, free=%d\n", index_of(f), free_count);
    return 0;
}
