/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export type JsonSchema7NeverType = {
  not: {};
};

export function parseNeverDef(): JsonSchema7NeverType {
  return {
    not: {},
  };
}
