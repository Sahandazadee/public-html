int sign(int v)
{
    if (v > 0) {
        return 1;
    } else if (v < 0) {
        return -1;
    }
}

int main(void) { return sign(3); }
