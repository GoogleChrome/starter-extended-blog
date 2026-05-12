/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZodReadonlyDef } from 'zod/v3';
import { parseDef } from '../parseDef';
import { Refs } from '../Refs';

export const parseReadonlyDef = (def: ZodReadonlyDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};
