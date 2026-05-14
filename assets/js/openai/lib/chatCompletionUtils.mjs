/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const isAssistantMessage = (message) => {
    return message?.role === 'assistant';
};
export const isToolMessage = (message) => {
    return message?.role === 'tool';
};
export function isPresent(obj) {
    return obj != null;
}
//# sourceMappingURL=chatCompletionUtils.mjs.map