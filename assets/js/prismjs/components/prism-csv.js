/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// https://tools.ietf.org/html/rfc4180

Prism.languages.csv = {
	'value': /[^\r\n,"]+|"(?:[^"]|"")*"(?!")/,
	'punctuation': /,/
};
