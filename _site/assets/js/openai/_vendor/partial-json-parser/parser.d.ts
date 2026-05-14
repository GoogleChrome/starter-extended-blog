/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

declare class PartialJSON extends Error {
}
declare class MalformedJSON extends Error {
}
declare const partialParse: (input: string) => any;
export { partialParse, PartialJSON, MalformedJSON };
//# sourceMappingURL=parser.d.ts.map