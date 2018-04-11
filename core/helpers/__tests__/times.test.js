const times = require('../times');

describe('time helpers', () => {
  describe('friendlyRuntime', () => {
    it('should take a string or a number', () => {
      expect(times.friendlyRuntime('1000')).toEqual(expect.any(String));
      expect(times.friendlyRuntime(100)).toEqual(expect.any(String));
    });

    it('should output ms < 1000 as ms', () => {
      expect(times.friendlyRuntime(900)).toBe('900ms');
    });
    
    it('should output ms > 1000 as seconds', () => {
      expect(times.friendlyRuntime(1000)).toBe('1s');
    });
  });
});