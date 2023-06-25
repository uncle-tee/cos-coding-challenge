export class MathUtil {
  static findAverage(values: number[]) {
    const sum = values
      .reduce((previousValue, currentValue) => previousValue + currentValue);
    return ((1 / values.length) * sum);
  }
}
