/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { TensorToDataUrlOptions, TensorToImageDataOptions } from './tensor-conversion.js';
import { Tensor } from './tensor.js';
/**
 * implementation of Tensor.toDataURL()
 */
export declare const tensorToDataURL: (tensor: Tensor, options?: TensorToDataUrlOptions) => string;
/**
 * implementation of Tensor.toImageData()
 */
export declare const tensorToImageData: (tensor: Tensor, options?: TensorToImageDataOptions) => ImageData;
//# sourceMappingURL=tensor-conversion-impl.d.ts.map