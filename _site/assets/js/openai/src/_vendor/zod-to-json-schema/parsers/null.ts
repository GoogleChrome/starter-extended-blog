/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Refs } from '../Refs';

export type JsonSchema7NullType = {
  type: 'null';
};

export function parseNullDef(refs: Refs): JsonSchema7NullType {
  return refs.target === 'openApi3' ?
      ({
        enum: ['null'],
        nullable: true,
      } as any)
    : {
        type: 'null',
      };
}
