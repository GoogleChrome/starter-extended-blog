/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReadonlyDef = void 0;
const parseDef_1 = require("../parseDef.js");
const parseReadonlyDef = (def, refs) => {
    return (0, parseDef_1.parseDef)(def.innerType._def, refs);
};
exports.parseReadonlyDef = parseReadonlyDef;
//# sourceMappingURL=readonly.js.map