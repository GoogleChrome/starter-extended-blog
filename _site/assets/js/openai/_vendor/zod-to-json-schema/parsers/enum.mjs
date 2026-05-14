/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export function parseEnumDef(def) {
    return {
        type: 'string',
        enum: [...def.values],
    };
}
//# sourceMappingURL=enum.mjs.map