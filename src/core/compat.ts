// Avoid importing Node types; use runtime feature detection.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const process: any;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const Buffer: any;

export const isNode =
  typeof process !== 'undefined' &&
  !!process?.versions?.node &&
  typeof window === 'undefined';

export const hasBuffer = typeof Buffer !== 'undefined';
