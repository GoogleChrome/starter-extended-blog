/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var remoteConfig = require('@firebase/remote-config');



Object.keys(remoteConfig).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return remoteConfig[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
