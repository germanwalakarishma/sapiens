import { jest } from '@jest/globals';

global.console = {
    ...console,
    log: jest.fn()
};