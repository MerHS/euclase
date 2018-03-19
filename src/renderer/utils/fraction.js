// @flow
class Fraction {
  x: number;
  y: number;

  static maxDenominator = 32 * 3 * 5 * 4; // 1920

  constructor(x: number | [number, number], y?: number) {
    if (typeof x !== 'number') {
      y = x[1];
      x = x[0];
    }

    if (y === undefined) {
      y = 1;
    }

    if (y === 0) {
      throw new Error('Fraction Constructor DivideByZeroException');
    } else if (y < 0) {
      x = -x;
      y = -y;
    }

    this.x = Math.round(x);
    this.y = Math.round(y);
    this.gcd();
  }

  static of(floatValue: number): Fraction {
    return new Fraction(floatValue * Fraction.maxDenominator, Fraction.maxDenominator);
  }

  static ofArr(arr: [number, number]): Fraction {
    return new Fraction(arr[0], arr[1]);
  }

  static ofInt(intValue: number): Fraction {
    return new Fraction(intValue, 1);
  }

  arr(): [number, number] {
    return [this.x, this.y];
  }

  value(): number {
    return this.x / this.y;
  }

  roundValue(): number {
    return Math.round(this.value());
  }

  floorValue(): number {
    return Math.floor(this.value());
  }

  ceilValue(): number {
    return Math.ceil(this.value());
  }

  decimalPart(): Fraction {
    return new Fraction(this.x % this.y, this.y);
  }

  add(that: Fraction | number): Fraction {
    if (typeof that === 'number') {
      return new Fraction(this.x, this.y).add(Fraction.of(that));
    }
    return new Fraction((this.x * that.y) + (this.y * that.x), this.y * that.y);
  }

  sub(that: Fraction | number): Fraction {
    if (typeof that === 'number') {
      return new Fraction(this.x, this.y).sub(Fraction.of(that));
    }
    return new Fraction((this.x * that.y) - (this.y * that.x), this.y * that.y);
  }

  mul(that: Fraction | number): Fraction {
    if (typeof that === 'number') {
      return new Fraction(this.x, this.y).mul(Fraction.of(that));
    }
    return new Fraction(this.x * that.x, this.y * that.y);
  }

  mulInt(that: number): Fraction {
    return new Fraction(this.x * that, this.y);
  }

  div(that: Fraction | number): Fraction {
    if (typeof that === 'number') {
      return new Fraction(this.x, this.y).div(Fraction.of(that));
    }
    if (that.x === 0) {
      throw new Error('Fraction div DividedByZeroException');
    }
    return new Fraction(this.x * that.y, this.y * that.x);
  }

  mod(that: Fraction): Fraction { // mod(a, b) == a - b * floor(a / b)
    return that.x === 0
      ? new Fraction(0, 1)
      : this.sub(that.mulInt(this.div(that).floorValue()));
  }

  gcd() {
    let gcd = this.x < 0 ? -this.x : this.x;
    let y = this.y;

    if (this.x === 0) {
      this.x = 0;
      this.y = 1;
    } else {
      for (let temp = gcd; y % gcd !== 0;) {
        temp = gcd;
        gcd = y % gcd;
        y = temp;
      }

      this.x = Math.round(this.x / gcd);
      this.y = Math.round(this.y / gcd);
    }
  }
}

export default Fraction;
