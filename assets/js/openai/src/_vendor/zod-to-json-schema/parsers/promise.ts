/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZodPromiseDef } from 'zod/v3';
import { JsonSchema7Type, parseDef } from '../parseDef';
import { Refs } from '../Refs';

export function parsePromiseDef(def: ZodPromiseDef, refs: Refs): JsonSchema7Type | undefined {
  return parseDef(def.type._def, refs);
}
