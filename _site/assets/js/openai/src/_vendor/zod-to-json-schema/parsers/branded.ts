/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZodBrandedDef } from 'zod/v3';
import { parseDef } from '../parseDef';
import { Refs } from '../Refs';

export function parseBrandedDef(_def: ZodBrandedDef<any>, refs: Refs) {
  return parseDef(_def.type._def, refs);
}
