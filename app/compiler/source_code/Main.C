#include <stdio.h>
int main() {
    double a, b, product;
    scanf("%lf %lf", &a, &b);  
     // Calculating product
    product = a * b;

    // Result up to 2 decimal point is displayed using %.2lf
    printf("%.2lf", product);
    
    return 0;
}