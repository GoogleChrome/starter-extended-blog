/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCatchDef = void 0;
const parseDef_1 = require("../parseDef.js");
const parseCatchDef = (def, refs) => {
    return (0, parseDef_1.parseDef)(def.innerType._def, refs);
};
exports.parseCatchDef = parseCatchDef;
//# sourceMappingURL=catch.js.map