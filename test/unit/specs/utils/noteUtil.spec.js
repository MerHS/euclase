

import { binarySearch, binarySearchIndex, mergeSortedList } from '@/utils/noteUtil';

describe('noteUtil', function () {
  function testSearch(list, matcher, index, value) {
    expect(binarySearchIndex(list, matcher)).to.equal(index);
    expect(binarySearch(list, matcher)).to.equal(value);
  }
  function testMerge(la, lb, comparator, value) {
    expect(mergeSortedList(la, lb, comparator)).to.deep.equal(value);
  }

  it('binarySearch', function () {
    const
      list = [1, 4, 6, 7, 9, 10, 13, 16],
      emptyList = [],
      singleton = [1];

    testSearch(list, x => x >= 8, 4, 9);
    testSearch(list, x => x >= 0, 0, 1);
    testSearch(list, x => x >= 20, -1, undefined);
    testSearch(emptyList, () => true, -1, undefined);
    testSearch(emptyList, () => false, -1, undefined);
    testSearch(singleton, x => x > 0, 0, 1);
    testSearch(singleton, x => x > 30, -1, undefined);
  });

  it('mergeSortedList', function () {
    const
      la = [1, 2, 3],
      lb = [3, 4, 5];

    testMerge(la, lb, (a, b) => a < b, [1, 2, 3, 4, 5]);
    testMerge(la.reverse(), lb.reverse(), (a, b) => a > b, [5, 4, 3, 2, 1]);
  });
});
