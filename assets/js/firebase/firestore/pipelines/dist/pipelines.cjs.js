/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pipelines = require('@firebase/firestore/pipelines');



Object.keys(pipelines).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return pipelines[k]; }
	});
});
//# sourceMappingURL=pipelines.cjs.js.map
