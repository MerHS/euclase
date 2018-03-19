import Fraction from '@/utils/fraction';

describe('fraction.js', function () {
  function expectEqual(frac, arr) {
    expect(frac.arr()).to.deep.equal(arr);
  }

  it('should create optimized fraction', function () {
    expectEqual(new Fraction([3, 6]), [1, 2]);
    expectEqual(new Fraction([12, -9]), [-4, 3]);
    expectEqual(new Fraction([-42, -48]), [7, 8]);
    expectEqual(new Fraction(8, 8), [1, 1]);
    expectEqual(new Fraction(0, 6), [0, 1]);
    expectEqual(new Fraction(-4), [-4, 1]);
  });

  it('should throw error with zero denominator', function () {
    expect(() => new Fraction(103, 0)).to.throw();
  });

  describe('of', function () {
    it('Fraction.of', function () {
      expectEqual(Fraction.of(1), [1, 1]);
      expectEqual(Fraction.of(3.3333333333333), [10, 3]);
      expectEqual(Fraction.of(-0.125), [-1, 8]);
    });
    it('Fraction.ofArr', function () {
      expectEqual(Fraction.ofArr([3, 6]), [1, 2]);
      expectEqual(Fraction.ofArr([12, -9]), [-4, 3]);
      expectEqual(Fraction.ofArr([-42, -48]), [7, 8]);
    });
    it('Fraction.ofInt', function () {
      expectEqual(Fraction.ofInt(1), [1, 1]);
      expectEqual(Fraction.ofInt(-3), [-3, 1]);
      expectEqual(Fraction.ofInt(0), [0, 1]);
    });
  });

  describe('value', function () {
    const sevenFour = new Fraction(7, 4);

    afterEach(function () {
      expectEqual(sevenFour, [7, 4]);
    });

    it('value', function () {
      expect(sevenFour.value()).to.equal(7 / 4);
    });

    it('roundValue', function () {
      expect(sevenFour.roundValue()).to.equal(2);
    });

    it('floorValue', function () {
      expect(sevenFour.floorValue()).to.equal(1);
    });

    it('ceilValue', function () {
      expect(sevenFour.ceilValue()).to.equal(2);
    });

    it('decimalPart', function () {
      expectEqual(sevenFour.decimalPart(), [3, 4]);
    });
  });

  describe('arithmetics', function () {
    const
      quarter = new Fraction(1, 4),
      oneSix = new Fraction(1, 6),
      fiveSeven = new Fraction(5, 7);

    afterEach(function () {
      expectEqual(quarter, [1, 4]);
      expectEqual(oneSix, [1, 6]);
      expectEqual(fiveSeven, [5, 7]);
    });

    it('add', function () {
      expectEqual(quarter.add(oneSix), [5, 12]);
      expectEqual(fiveSeven.add(-2), [-9, 7]);
    });
    it('sub', function () {
      expectEqual(quarter.sub(oneSix), [1, 12]);
      expectEqual(fiveSeven.sub(2), [-9, 7]);
    });
    it('mul', function () {
      expectEqual(quarter.mul(oneSix), [1, 24]);
      expectEqual(fiveSeven.mul(3.5), [5, 2]);
    });
    it('mulInt', function () {
      expectEqual(quarter.mulInt(0), [0, 1]);
      expectEqual(fiveSeven.mulInt(10), [50, 7]);
    });
    it('div', function () {
      expectEqual(quarter.div(oneSix), [3, 2]);
      expect(() => fiveSeven.div(0)).to.throw();
    });
    it('mod', function () {
      expectEqual(quarter.mod(oneSix), [1, 12]);
      expectEqual(fiveSeven.mod(quarter), [3, 14]);
      expectEqual(fiveSeven.mod(Fraction.of(0)), [0, 1]);
    });
  });
});
