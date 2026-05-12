/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZodCatchDef } from 'zod/v3';
import { parseDef } from '../parseDef';
import { Refs } from '../Refs';

export const parseCatchDef = (def: ZodCatchDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};
