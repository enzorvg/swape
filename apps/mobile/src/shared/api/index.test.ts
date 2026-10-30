import { api, API_URL, createApiClient } from './index';

describe('mobile shared api', () => {
  it('exposes a singleton api client instance', () => {
    expect(api).toBeDefined();
    expect(typeof api.GET).toBe('function');
    expect(typeof api.POST).toBe('function');
  });

  it('exposes API_URL configured from environment or fallback', () => {
    expect(typeof API_URL).toBe('string');
    expect(API_URL.length).toBeGreaterThan(0);
  });

  it('exports createApiClient function', () => {
    expect(typeof createApiClient).toBe('function');
    const customClient = createApiClient('http://custom-url:9999');
    expect(customClient).toBeDefined();
    expect(typeof customClient.GET).toBe('function');
  });
});
