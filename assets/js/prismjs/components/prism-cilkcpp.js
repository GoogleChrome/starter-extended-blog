/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

Prism.languages.cilkcpp = Prism.languages.insertBefore('cpp', 'function', {
	'parallel-keyword': {
		pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
		alias: 'keyword'
	}
});

Prism.languages['cilk-cpp'] = Prism.languages['cilkcpp'];
Prism.languages['cilk'] = Prism.languages['cilkcpp'];
