/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as qs from '../qs/stringify';

export function stringifyQuery(query: object | Record<string, unknown>) {
  return qs.stringify(query, { arrayFormat: 'brackets' });
}
