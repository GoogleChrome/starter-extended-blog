/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEffectsDef = parseEffectsDef;
const parseDef_1 = require("../parseDef.js");
function parseEffectsDef(_def, refs, forceResolution) {
    return refs.effectStrategy === 'input' ? (0, parseDef_1.parseDef)(_def.schema._def, refs, forceResolution) : {};
}
//# sourceMappingURL=effects.js.map