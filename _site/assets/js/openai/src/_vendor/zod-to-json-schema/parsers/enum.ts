/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZodEnumDef } from 'zod/v3';

export type JsonSchema7EnumType = {
  type: 'string';
  enum: string[];
};

export function parseEnumDef(def: ZodEnumDef): JsonSchema7EnumType {
  return {
    type: 'string',
    enum: [...def.values],
  };
}
