/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnumDef = parseEnumDef;
function parseEnumDef(def) {
    return {
        type: 'string',
        enum: [...def.values],
    };
}
//# sourceMappingURL=enum.js.map