import { constVoid } from '../../src/utils/function';

describe('constVoid', () => {
  it('should return nothing', () => {
    expect(constVoid).not.toThrow();
    expect(constVoid()).not.toBeDefined();
  });
});
