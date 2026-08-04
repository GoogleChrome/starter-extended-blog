/**
 * @license
 * Copyright 2024 Google LLC
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
import { Content, CountTokensRequest, CountTokensResponse, GenerateContentRequest, GenerateContentResult, GenerateContentStreamResult, GenerationConfig, ModelParams, Part, SafetySetting, RequestOptions, StartChatParams, Tool, ToolConfig, SingleRequestOptions } from '../types';
import { ChatSession } from '../methods/chat-session';
import { AI } from '../public-types';
import { AIModel } from './ai-model';
import { ChromeAdapter } from '../types/chrome-adapter';
/**
 * Class for generative model APIs.
 * @public
 */
export declare class GenerativeModel extends AIModel {
    private chromeAdapter?;
    generationConfig: GenerationConfig;
    safetySettings: SafetySetting[];
    requestOptions?: RequestOptions;
    tools?: Tool[];
    toolConfig?: ToolConfig;
    systemInstruction?: Content;
    constructor(ai: AI, modelParams: ModelParams, requestOptions?: RequestOptions, chromeAdapter?: ChromeAdapter | undefined);
    /**
     * Initializes on-device models.
     *
     * @remarks
     * This may trigger a download on first
     * use. Wait for this promise to complete before calling inference
     * methods if you want to ensure the device models are ready before
     * any calls. Calling inference methods before the device is ready
     * will result in a cloud fallback if `inferenceMode` is set to
     * `PREFER_ON_DEVICE`, and an error if set to `ONLY_ON_DEVICE`.
     *
     * IMPORTANT: This call must be made on or after a user has interacted
     * with the page (for example, through a button click or key press).
     * If it is called without a user interaction, and it requires a download,
     * this will cause an error.
     *
     * See the
     * {@link https://developer.chrome.com/docs/ai/prompt-api#use_the_prompt_api | Prompt API docs }
     * for more details on this requirement.
     *
     * @param onDownloadProgress A callback called repeatedly as the
     * download progresses that provides a `progressValue` between 0
     * and 1 representing how much of the download is complete. This
     * will be ignored if `monitor` was populated in
     * {@link LanguageModelCreateOptions}.
     *
     * @public
     */
    initializeDeviceModel(onDownloadProgress?: (progressValue: number) => void): Promise<void>;
    /**
     * Makes a single non-streaming call to the model
     * and returns an object containing a single {@link GenerateContentResponse}.
     */
    generateContent(request: GenerateContentRequest | string | Array<string | Part>, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentResult>;
    /**
     * Makes a single streaming call to the model
     * and returns an object containing an iterable stream that iterates
     * over all chunks in the streaming response as well as
     * a promise that returns the final aggregated response.
     */
    generateContentStream(request: GenerateContentRequest | string | Array<string | Part>, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentStreamResult>;
    /**
     * Gets a new {@link ChatSession} instance which can be used for
     * multi-turn chats.
     */
    startChat(startChatParams?: StartChatParams): ChatSession;
    /**
     * Counts the tokens in the provided request.
     */
    countTokens(request: CountTokensRequest | string | Array<string | Part>, singleRequestOptions?: SingleRequestOptions): Promise<CountTokensResponse>;
}
/**
 * Client-side validation of some common `GenerationConfig` pitfalls, in order
 * to save the developer a wasted request.
 */
export declare function validateGenerationConfig(generationConfig: GenerationConfig): void;
