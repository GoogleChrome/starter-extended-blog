/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export function parseNullDef(refs) {
    return refs.target === 'openApi3' ?
        {
            enum: ['null'],
            nullable: true,
        }
        : {
            type: 'null',
        };
}
//# sourceMappingURL=null.mjs.map