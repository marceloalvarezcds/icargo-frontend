import { preventTypingNonNumericCharacters } from './thousands-separator';


describe('utils/thousands-separator', () => {
  const preventDefault = () => {}
  const event1Spy = jasmine.createSpyObj({ preventDefault }, { which: 58 });
  const event2Spy = jasmine.createSpyObj({ preventDefault }, { which: 106 });
  const event3Spy = jasmine.createSpyObj({ preventDefault }, { which: 100 });
  it('should be created', () => {
    preventTypingNonNumericCharacters(event1Spy as KeyboardEvent);
    preventTypingNonNumericCharacters(event2Spy as KeyboardEvent);
    preventTypingNonNumericCharacters(event3Spy as KeyboardEvent);
    expect(event1Spy.preventDefault).toHaveBeenCalled();
    expect(event2Spy.preventDefault).toHaveBeenCalled();
    expect(event3Spy.preventDefault).not.toHaveBeenCalled();
  });
});
