import { NumberFormatPipe } from './number-format.pipe';

describe('NumberFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberFormatPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(1000)).toBe('1.000');
  });
});
