/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isToolMessage = exports.isAssistantMessage = void 0;
exports.isPresent = isPresent;
const isAssistantMessage = (message) => {
    return message?.role === 'assistant';
};
exports.isAssistantMessage = isAssistantMessage;
const isToolMessage = (message) => {
    return message?.role === 'tool';
};
exports.isToolMessage = isToolMessage;
function isPresent(obj) {
    return obj != null;
}
//# sourceMappingURL=chatCompletionUtils.js.map