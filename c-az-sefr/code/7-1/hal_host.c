#include <stdio.h>
#include "hal_host.h"
#include "sim_sensor.h"

static uint32_t now_ms;

/* «تایپ‌های کاربر»: هر ورودی در لحظهٔ at_ms به UART می‌رسد */
static const struct {
    uint32_t    at_ms;
    const char *text;
} script[] = {
    {   200, "STATUS\n" },
    {   400, "FOO\n" },
    {   600, "START\n" },
    {  8000, "STATUS\n" },
    { 17000, "DUMP\n" },
    { 18500, "STOP\n" },
    { 19000, "STATUS\n" },
};
#define SCRIPT_LEN (sizeof script / sizeof script[0])

static size_t entry;                    /* ورودی جاری اسکریپت */
static size_t pos;                      /* نویسهٔ جاری همان ورودی */

static bool host_getc(char *c)
{
    if (entry >= SCRIPT_LEN || now_ms < script[entry].at_ms) {
        return false;
    }
    *c = script[entry].text[pos++];
    if (script[entry].text[pos] == '\0') {
        entry++;
        pos = 0u;
    }
    return true;
}

static void host_write(const char *s)   { fputs(s, stdout); }
static void host_led(bool on)           { printf("[LED %s]\n", on ? "ON" : "OFF"); }
static uint32_t host_millis(void)       { return now_ms; }

static const hal_t host_hal = {
    sim_sensor_read, host_write, host_getc, host_led, host_millis
};

const hal_t *hal_host_get(void)         { return &host_hal; }
void hal_host_advance(uint32_t ms)      { now_ms += ms; }
