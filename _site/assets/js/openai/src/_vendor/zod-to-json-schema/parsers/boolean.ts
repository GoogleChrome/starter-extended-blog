/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export type JsonSchema7BooleanType = {
  type: 'boolean';
};

export function parseBooleanDef(): JsonSchema7BooleanType {
  return {
    type: 'boolean',
  };
}
