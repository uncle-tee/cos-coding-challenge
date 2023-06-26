export class MathUtil {
  static findAverage(values: number[]) {
    if (!values.length) {
      return 0;
    }
    const sum = values.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    return (1 / values.length) * sum;
  }
}
