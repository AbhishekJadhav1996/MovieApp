const { formatResponse } = require('../src/utils/helper');

describe('Helper: formatResponse', () => {
  it('should format response correctly', () => {
    const result = formatResponse(true, { id: 1 }, 'Success');
    expect(result).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Success'
    });

    const result2 = formatResponse(false, null);
    expect(result2).toEqual({
      success: false,
      data: null,
      message: ''
    });
  });
});
