/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export declare const toBase64: (data: string | Uint8Array | null | undefined) => string;
export declare const fromBase64: (str: string) => Uint8Array;
/**
 * Converts a Base64 encoded string to a Float32Array.
 * @param base64Str - The Base64 encoded string.
 * @returns An Array of numbers interpreted as Float32 values.
 */
export declare const toFloat32Array: (base64Str: string) => Array<number>;
//# sourceMappingURL=base64.d.ts.map