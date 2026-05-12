/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseDef } from "../parseDef.mjs";
export function parseBrandedDef(_def, refs) {
    return parseDef(_def.type._def, refs);
}
//# sourceMappingURL=branded.mjs.map