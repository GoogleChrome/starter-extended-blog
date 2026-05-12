/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sw = require('@firebase/messaging/sw');



Object.keys(sw).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return sw[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
