/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export declare function playAudio(input: NodeJS.ReadableStream | Response | File): Promise<void>;
type RecordAudioOptions = {
    signal?: AbortSignal;
    device?: number;
    timeout?: number;
};
export declare function recordAudio(options?: RecordAudioOptions): Promise<File>;
export {};
//# sourceMappingURL=audio.d.ts.map