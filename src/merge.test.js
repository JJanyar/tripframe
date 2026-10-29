// npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { codecString } from './merge.js';

test('codec strings for the decoder come from the avcC and hvcC boxes', () => {
  assert.equal(codecString({ codec: 'avc', config: new Uint8Array([1, 0x64, 0x00, 0x33, 0xff]) }), 'avc1.640033');
  // HEVC Main, level 5.1, compatible with profiles 1 and 2, progressive and frame-only constraints
  const hvcc = new Uint8Array([1, 0x01, 0x60, 0, 0, 0, 0xb0, 0, 0, 0, 0, 0, 153]);
  assert.equal(codecString({ codec: 'hevc', config: hvcc }), 'hvc1.1.6.L153.B0');
  // high tier, Main 10
  const high = new Uint8Array([1, 0x22, 0x20, 0, 0, 0, 0x90, 0, 0, 0, 0, 0, 120]);
  assert.equal(codecString({ codec: 'hevc', config: high }), 'hvc1.2.4.H120.90');
});
