/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseDef } from "../parseDef.mjs";
export const parseReadonlyDef = (def, refs) => {
    return parseDef(def.innerType._def, refs);
};
//# sourceMappingURL=readonly.mjs.map