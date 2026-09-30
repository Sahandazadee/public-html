/* اسکریپت لینکر مینیمال برای STM32F411RE */
ENTRY(Reset_Handler)

/* بالای RAM: SP اولیه. پشته به سمت پایین رشد می‌کند */
_estack = ORIGIN(RAM) + LENGTH(RAM);

MEMORY
{
    FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 512K
    RAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 128K
}

SECTIONS
{
    /* جدول وقفه باید اولین چیز در Flash باشد */
    .isr_vector :
    {
        . = ALIGN(4);
        KEEP(*(.isr_vector))
        . = ALIGN(4);
    } > FLASH

    .text :
    {
        . = ALIGN(4);
        *(.text*)
        . = ALIGN(4);
    } > FLASH

    .rodata :
    {
        . = ALIGN(4);
        *(.rodata*)
        . = ALIGN(4);
    } > FLASH

    /* آدرس ذخیرهٔ مقدارهای اولیهٔ .data در Flash */
    _sidata = LOADADDR(.data);

    /* .data در RAM زندگی می‌کند ولی تصویرش در Flash است */
    .data :
    {
        . = ALIGN(4);
        _sdata = .;
        *(.data*)
        . = ALIGN(4);
        _edata = .;
    } > RAM AT > FLASH

    .bss :
    {
        . = ALIGN(4);
        _sbss = .;
        *(.bss*)
        *(COMMON)
        . = ALIGN(4);
        _ebss = .;
    } > RAM

    /DISCARD/ : { *(.ARM.exidx*) *(.comment) }

    /* بررسی زمان لینک: حداقل ۱ کیلوبایت RAM برای پشته بماند */
    ASSERT(_ebss + 0x400 <= _estack, "RAM is too full: less than 1 KiB left for the stack")
}
