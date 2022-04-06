import { MomentFormatPipe } from './moment-format.pipe';
import * as moment from 'moment';

describe('MomentFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new MomentFormatPipe();
    const momen = moment('20220101', 'YYYYMMDD');
    const format = 'YYYY';
    const result = momen.format(format);
    expect(pipe).toBeTruthy();
    expect(pipe.transform(momen, format)).toBe(result);
    expect(pipe.transform(null, format)).toBe('');
  });
});
