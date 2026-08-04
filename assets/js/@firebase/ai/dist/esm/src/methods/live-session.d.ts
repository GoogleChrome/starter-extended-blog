/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { FunctionResponse, GenerativeContentBlob, LiveServerContent, LiveServerGoingAwayNotice, LiveServerToolCall, LiveServerToolCallCancellation, LiveSessionResumptionUpdate, Part, SessionResumptionConfig } from '../public-types';
import { WebSocketHandler } from '../websocket';
import { _LiveClientSetup } from '../types/live-responses';
import { ApiSettings } from '../types/internal';
/**
 * Represents an active, real-time, bidirectional conversation with the model.
 *
 * This class should only be instantiated by calling {@link LiveGenerativeModel.connect}.
 *
 * @beta
 */
export declare class LiveSession {
    private _setupMessage;
    private _apiSettings;
    private _sessionResumption?;
    /**
     * Indicates whether this Live session is closed.
     *
     * @beta
     */
    isClosed: boolean;
    /**
     * Indicates whether this Live session is being controlled by an `AudioConversationController`.
     *
     * @beta
     */
    inConversation: boolean;
    /**
     * Allows external code to await the opening of the WebSocket connection.
     */
    connectionPromise: Promise<void>;
    /**
     * Generator yielding WebSocket messages from the server.
     */
    private _serverMessages;
    /**
     * WebSocket handler. Injectable for testing.
     */
    private _webSocketHandler;
    /**
     * @internal
     */
    constructor(_setupMessage: _LiveClientSetup, _apiSettings: ApiSettings, _sessionResumption?: SessionResumptionConfig | undefined, webSocketHandler?: WebSocketHandler);
    /**
     * Initializes connection to the WebSocket. Should be called immediately
     * after instantiation.
     *
     * @internal
     */
    private _connectSession;
    /**
     * Resumes an existing live session with the server.
     *
     * This closes the current WebSocket connection and establishes a new one using
     * the same configuration (URI, headers, model, system instruction, tools, etc.)
     * as the original session.
     *
     * @param sessionResumption - The configuration for session resumption, such as the handle to the previous session state to restore.
     * @throws If the session resumption configuration is unsupported.
     *
     * @beta
     */
    resumeSession(sessionResumption?: SessionResumptionConfig): Promise<void>;
    /**
     * Sends content to the server.
     *
     * @param request - The message to send to the model.
     * @param turnComplete - Indicates if the turn is complete. Defaults to false.
     * @throws If this session has been closed.
     *
     * @beta
     */
    send(request: string | Array<string | Part>, turnComplete?: boolean): Promise<void>;
    /**
     * Sends text to the server in realtime.
     *
     * @example
     * ```javascript
     * liveSession.sendTextRealtime("Hello, how are you?");
     * ```
     *
     * @param text - The text data to send.
     * @throws If this session has been closed.
     *
     * @beta
     */
    sendTextRealtime(text: string): Promise<void>;
    /**
     * Sends audio data to the server in realtime.
     *
     * @remarks The server requires that the audio data is base64-encoded 16-bit PCM at 16kHz
     * little-endian.
     *
     * @example
     * ```javascript
     * // const pcmData = ... base64-encoded 16-bit PCM at 16kHz little-endian.
     * const blob = { mimeType: "audio/pcm", data: pcmData };
     * liveSession.sendAudioRealtime(blob);
     * ```
     *
     * @param blob - The base64-encoded PCM data to send to the server in realtime.
     * @throws If this session has been closed.
     *
     * @beta
     */
    sendAudioRealtime(blob: GenerativeContentBlob): Promise<void>;
    /**
     * Sends video data to the server in realtime.
     *
     * @remarks The server requires that the video is sent as individual video frames at 1 FPS. It
     * is recommended to set `mimeType` to `image/jpeg`.
     *
     * @example
     * ```javascript
     * // const videoFrame = ... base64-encoded JPEG data
     * const blob = { mimeType: "image/jpeg", data: videoFrame };
     * liveSession.sendVideoRealtime(blob);
     * ```
     * @param blob - The base64-encoded video data to send to the server in realtime.
     * @throws If this session has been closed.
     *
     * @beta
     */
    sendVideoRealtime(blob: GenerativeContentBlob): Promise<void>;
    /**
     * Sends function responses to the server.
     *
     * @param functionResponses - The function responses to send.
     * @throws If this session has been closed.
     *
     * @beta
     */
    sendFunctionResponses(functionResponses: FunctionResponse[]): Promise<void>;
    /**
     * Yields messages received from the server.
     * This can only be used by one consumer at a time.
     *
     * @returns An `AsyncGenerator` that yields server messages as they arrive.
     * @throws If the session is already closed, or if we receive a response that we don't support.
     *
     * @beta
     */
    receive(): AsyncGenerator<LiveServerContent | LiveServerToolCall | LiveServerToolCallCancellation | LiveServerGoingAwayNotice | LiveSessionResumptionUpdate>;
    /**
     * Closes this session.
     * All methods on this session will throw an error once this resolves.
     *
     * @beta
     */
    close(): Promise<void>;
    /**
     * Sends realtime input to the server.
     *
     * @deprecated Use `sendTextRealtime()`, `sendAudioRealtime()`, and `sendVideoRealtime()` instead.
     *
     * @param mediaChunks - The media chunks to send.
     * @throws If this session has been closed.
     *
     * @beta
     */
    sendMediaChunks(mediaChunks: GenerativeContentBlob[]): Promise<void>;
    /**
     * @deprecated Use `sendTextRealtime()`, `sendAudioRealtime()`, and `sendVideoRealtime()` instead.
     *
     * Sends a stream of {@link GenerativeContentBlob}.
     *
     * @param mediaChunkStream - The stream of {@link GenerativeContentBlob} to send.
     * @throws If this session has been closed.
     *
     * @beta
     */
    sendMediaStream(mediaChunkStream: ReadableStream<GenerativeContentBlob>): Promise<void>;
}
