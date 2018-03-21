import * as _ from 'lodash';

import { CanvasInfo } from '../store/editor';
import { LaneStylePart, LaneTheme } from './themeTypes';
import Fraction from './fraction';
import { Coord, Rect } from './scoreTypes';


export default class CanvasUtil {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  width(): number {
    return this.ctx.canvas.width;
  }

  height(): number {
    return this.ctx.canvas.height;
  }

  flipCoord(coord: Coord): Coord {
    return [coord[0], this.ctx.canvas.height - coord[1]];
  }

  flipRect(rect: Rect): Rect {
    return [this.flipCoord(rect[0]), this.flipCoord(rect[1])];
  }

  static getCanvasUtil(canvas: HTMLCanvasElement): CanvasUtil {
    const ctx = canvas.getContext('2d');
    if (ctx !== null) {
      return new CanvasUtil(ctx);
    } else {
      throw Error(`Cannot get CanvasRenderingContext2D from canvas object: ${canvas}`);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width(), this.height());
  }

  fillBackground(colorText: string) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = colorText;
    ctx.fillRect(0, 0, this.width(), this.height());
    ctx.restore();
  }

  // drawLine(
  //   dotList: Array<Coord>,
  //   strokeStyle: string = 'black',
  //   lineWidth: number = 0.5,
  // ) {
  //   const ctx = this.ctx;
  //   ctx.save();
  //   ctx.strokeStyle = strokeStyle;
  //   ctx.lineWidth = lineWidth;
  //   ctx.beginPath();
  //
  //   ctx.moveTo(...dotList[0]);
  //   for (let i = 1; i < dotList.length; i += 1) {
  //     ctx.lineTo(...dotList[i]);
  //   }
  //
  //   ctx.stroke();
  //   ctx.restore();
  // }
  //
  // /**
  //  * @param strokeStyle: 'rgb(10,20,30)'
  //  * @param lineList: [[[x0,y0], [x1,y1], [x2,y2]], [[x3,y3], [x4,y4]]]
  //  * @param lineWidth: number
  //  */
  // drawLineList(
  //   lineList: Array<Array<Coord>>,
  //   strokeStyle: string = 'black',
  //   lineWidth: number = 0.5,
  // ) {
  //   const ctx = this.ctx;
  //   ctx.save();
  //   ctx.strokeStyle = strokeStyle;
  //   ctx.lineWidth = lineWidth;
  //   ctx.beginPath();
  //
  //   lineList.forEach((dotList) => {
  //     ctx.moveTo(...dotList[0]);
  //     for (let i = 1; i < dotList.length; i += 1) {
  //       ctx.lineTo(...dotList[i]);
  //     }
  //   });
  //
  //   ctx.stroke();
  //   ctx.restore();
  // }
  //
  // /**
  //  * @param fracList : Array<Fraction>
  //  * @param strokeStyle
  //  * @param lineWidth
  //  */
  // drawHorizontalLinesByFrac(
  //   fracList: Array<Fraction>,
  //   strokeStyle: string = 'black',
  //   lineWidth: number = 0.5,
  // ) {
  //   const [width, height] = [this.width(), this.height()];
  //
  //   const lineList = fracList.map((frac) => {
  //     const localHeight = height * (1 - frac.value());
  //     return [[0, localHeight], [width, localHeight]];
  //   });
  //
  //   this.drawLineList(lineList, strokeStyle, lineWidth);
  // }
  //
  // drawHorizontalLinesByYPos(
  //   yPosList: Array<number>,
  //   strokeStyle: string = 'black',
  //   lineWidth: number = 0.5,
  // ) {
  //   const [width, height] = [this.width(), this.height()];
  //
  //   const lineList = yPosList.map(localHeight =>
  //     [[0, height - localHeight], [width, height - localHeight]]);
  //
  //   this.drawLineList(lineList, strokeStyle, lineWidth);
  // }

  drawEditor(
    canvasInfo: CanvasInfo,
    laneTheme: LaneTheme,
  ) {
    const
      gridColors = laneTheme.gridColors,
      laneStyles = laneTheme.laneStyles,
      ctx = this.ctx,
      canvasHeight = this.height(),
      canvasWidth = this.width();

    this.clear();
    this.fillBackground(gridColors.backgroundColor);

    // Draw Background of Each Lanes
    let laneX = 0;
    laneStyles.forEach((style: LaneStylePart) => {
      ctx.fillStyle = style.laneBackgroundColor;
      this._drawRect(laneX, 0, style.width, canvasHeight);
      laneX += style.width;
    });

    // Stroke Horizontal Panel Splitter
    ctx.strokeStyle = gridColors.sectionBorderColor;
    ctx.lineWidth = gridColors.lineWidth;
    ctx.beginPath();
    for (let laneNo = 0; laneNo < canvasInfo.panelYList.length; laneNo += 1) {
      const laneY = canvasInfo.panelYList[laneNo];
      this._drawLine(0, canvasHeight - laneY, canvasWidth, canvasHeight - laneY);
    }
    ctx.stroke();

    // Stroke Main Grid
    ctx.strokeStyle = gridColors.mainGridColor;
    ctx.beginPath();
    for (let laneNo = 0; laneNo < canvasInfo.mainGridYList.length; laneNo += 1) {
      const laneY = canvasInfo.mainGridYList[laneNo];
      this._drawLine(0, canvasHeight - laneY, canvasWidth, canvasHeight - laneY);
    }
    ctx.stroke();

    // Stroke Sub Grid
    ctx.strokeStyle = gridColors.subGridColor;
    ctx.beginPath();
    for (let laneNo = 0; laneNo < canvasInfo.subGridYList.length; laneNo += 1) {
      const laneY = canvasInfo.subGridYList[laneNo];
      this._drawLine(0, canvasHeight - laneY, canvasWidth, canvasHeight - laneY);
    }
    ctx.stroke();

    // Stroke Vertical Lane Splitter
    laneX = 0;
    ctx.strokeStyle = gridColors.verticalLineColor;
    ctx.lineWidth = gridColors.lineWidth;
    ctx.beginPath();
    laneStyles.forEach((style: LaneStylePart) => {
      this._drawLine(laneX, 0, laneX, canvasHeight);
      laneX += style.width;
    });
    ctx.stroke();

    // Draw Panel Number  TODO: to text dom
    ctx.font = '13px sans-serif';
    ctx.fillStyle = gridColors.sectionNumberColor;
    // ctx.strokeStyle = gridColors.sectionNumberColor;
    for (let laneNo = 0; laneNo < canvasInfo.panelYList.length; laneNo += 1) {
      const laneY = canvasInfo.panelYList[laneNo];
      const laneStr = _.padStart(`${laneNo}`, 3, '0');
      // ctx.strokeText(`[${laneStr}]`, 0, canvasHeight - (laneY + 3));
      ctx.fillText(`[${laneStr}]`, 0, canvasHeight - (laneY + 3));
    }
  }

  // PRIVATE METHODS

  /**
   * Pixel Perfect Draw Line
   * @private
   */
  _drawLine(x0: number, y0: number, x1: number, y1: number) {
    this.ctx.moveTo(CanvasUtil._linePixel(x0), CanvasUtil._linePixel(y0));
    this.ctx.lineTo(CanvasUtil._linePixel(x1), CanvasUtil._linePixel(y1));
  }

  /**
   * Pixel Perfect Draw Rect
   * @private
   */
  _drawRect(x: number, y: number, w: number, h: number) {
    this.ctx.fillRect(Math.round(x), Math.round(y),
      Math.round(w), Math.round(h));
  }

  /**
   * match pixel position to the middle of pixel
   * (e.g. (3, 5.4) -> (3.5, 5.5))
   * @param {number} pos
   */
  static _linePixel(pos: number): number {
    return Math.round(pos + 0.5) - 0.5;
  }
}
