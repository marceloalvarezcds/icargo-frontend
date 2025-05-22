import { NumberDecimalFormatPipe } from './number-decimal-format.pipe';

describe('NumberDecimalFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberDecimalFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
