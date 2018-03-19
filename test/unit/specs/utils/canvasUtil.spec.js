/* eslint-disable no-unused-expressions */
import sinon from 'sinon';

import CanvasUtil from '@/utils/canvasUtil';
import { red } from '@/utils/themeConst';

describe('canvasUtil.js', function () {
  const
    sandbox = sinon.createSandbox(),
    width = 200,
    height = 300,
    coord = [10, 20],
    rect = [[10, 20], [30, 40]],
    redHex = '#ff0000';

  let
    canvas,
    ctx,
    util;

  beforeEach(function () {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    util = CanvasUtil.getCanvasUtil(canvas);

    [
      'moveTo', 'lineTo', 'stroke', 'fillRect', 'clearRect',
    ].forEach(method => sandbox.spy(ctx, method));
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should make correct ctx', function () {
    expect(util.ctx).to.equal(ctx);
    expect(util.width()).to.equal(width);
    expect(util.height()).to.equal(height);
  });

  it('fillBackground', function () {
    util.fillBackground(red);
    expect(ctx.fillRect).to.have.been.calledOnce;
    expect(ctx.fillRect).to.have.been.calledWithExactly(0, 0, width, height);
    expect(ctx.fillStyle).to.equal(redHex);
  });

  it('clear', function () {
    util.clear();
    expect(ctx.clearRect).to.have.been.calledOnce;
    expect(ctx.clearRect).to.have.been.calledWithExactly(0, 0, width, height);
  });

  it('flips', function () {
    expect(util.flipCoord(coord)).to.deep.equal([10, 280]);
    expect(util.flipRect(rect)).to.deep.equal([[10, 280], [30, 260]]);
  });

  it('drawLine', function () {
    const coordList = [[10, 20], [30, 40], [50, 10]];
    util.drawLine(coordList, red, 1);

    expect(ctx.strokeStyle).to.equal(redHex);
    expect(ctx.lineWidth).to.equal(1);

    expect(ctx.moveTo).to.have.been.calledOnce;
    expect(ctx.moveTo).to.have.been.calledWith(...coordList[0]);

    expect(ctx.lineTo).to.have.been.calledAfter(ctx.moveTo);
    expect(ctx.lineTo).to.have.been.calledTwice;
    expect(ctx.lineTo.withArgs(...coordList[1])).to.have.been.calledOnce;
    expect(ctx.lineTo.withArgs(...coordList[2])).to.have.been.calledOnce;

    expect(ctx.stroke).to.have.been.calledOnce;
  });

  // it('drawLineList', function () {
  //
  // });
  //
  // it('drawHorizontalLineByFrac', function () {
  //
  // });
});
