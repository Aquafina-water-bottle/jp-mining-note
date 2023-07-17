/**
 * @jest-environment jsdom
 */

import { attemptParseOverride } from '../options';

test('attemptParseOverride const true', () => {
  expect(attemptParseOverride(true, true)).toBe(true);
});

test('attemptParseOverride const false', () => {
  expect(attemptParseOverride(false, true)).toBe(false);
});

test('attemptParseOverride const wrong', () => {
  expect(attemptParseOverride(3, true)).toBe(undefined);
});

test('attemptParseOverride isMobile without mobile', () => {
  expect(
    attemptParseOverride(
      {
        type: 'isMobile',
        resultTrue: true,
        resultFalse: false,
      },
      true
    )
  ).toBe(false);
});

test('attemptParseOverride isMobile with mobile', () => {
  document.documentElement.classList.toggle('mobile', true);

  expect(
    attemptParseOverride(
      {
        type: 'isMobile',
        resultTrue: true,
        resultFalse: false,
      },
      true
    )
  ).toBe(true);

  document.documentElement.classList.toggle('mobile', false);
});

test('attemptParseOverride isPC with mobile', () => {
  document.documentElement.classList.toggle('mobile', true);

  expect(
    attemptParseOverride(
      {
        type: 'isPC',
        resultTrue: true,
        resultFalse: false,
      },
      true
    )
  ).toBe(false);

  document.documentElement.classList.toggle('mobile', false);
});
