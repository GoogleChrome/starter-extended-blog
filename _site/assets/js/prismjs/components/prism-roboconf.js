/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

Prism.languages.roboconf = {
	'comment': /#.*/,
	'keyword': {
		'pattern': /(^|\s)(?:(?:external|import)\b|(?:facet|instance of)(?=[ \t]+[\w-]+[ \t]*\{))/,
		lookbehind: true
	},
	'component': {
		pattern: /[\w-]+(?=[ \t]*\{)/,
		alias: 'variable'
	},
	'property': /[\w.-]+(?=[ \t]*:)/,
	'value': {
		pattern: /(=[ \t]*(?![ \t]))[^,;]+/,
		lookbehind: true,
		alias: 'attr-value'
	},
	'optional': {
		pattern: /\(optional\)/,
		alias: 'builtin'
	},
	'wildcard': {
		pattern: /(\.)\*/,
		lookbehind: true,
		alias: 'operator'
	},
	'punctuation': /[{},.;:=]/
};
