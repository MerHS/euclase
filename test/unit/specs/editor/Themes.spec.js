import { colorStr } from '@/utils/themeConst';

describe('Themes', function () {
  it('colorStr', function () {
    expect(colorStr(1, 2, 3)).to.equal('rgb(1, 2, 3)');
    expect(colorStr(-1, 2.2, 333)).to.equal('rgb(0, 2, 255)');
    expect(colorStr(0, 1, 2, 3)).to.equal('rgba(0, 1, 2, 3)');
  });
});
