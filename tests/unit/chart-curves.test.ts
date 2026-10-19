import { describe, it, expect } from 'vitest';
import {
  linearCurve,
  smoothCurve,
  stepCurve,
  chartSeriesColor,
} from '../../packages/react/src/lib/chart-utils';
describe('original chart curve geometry', () => {
  it('closes areas by returning along the reverse baseline', () => {
    expect(
      linearCurve.area(
        [
          [0, 4],
          [5, 8],
        ],
        [
          [0, 10],
          [5, 10],
        ],
      ),
    ).toBe('M0,4L5,8L5,10L0,10Z');
  });
  it('handles empty and single readings without invalid paths', () => {
    for (const curve of [linearCurve, smoothCurve, stepCurve]) {
      expect(curve.line([])).toBe('');
      expect(curve.line([[3, 4]])).toBe('M3,4');
      expect(curve.area([], [])).toBe('');
    }
    expect(
      smoothCurve.line([
        [0, 1],
        [2, 3],
        [4, 2],
      ]),
    ).not.toMatch(/NaN|undefined/);
  });
  it('wraps palette indices consistently', () => {
    expect(chartSeriesColor(-1)).toBe(chartSeriesColor(5));
  });
});
