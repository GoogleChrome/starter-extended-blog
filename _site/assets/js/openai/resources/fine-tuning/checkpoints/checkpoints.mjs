/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import * as PermissionsAPI from "./permissions.mjs";
import { Permissions, } from "./permissions.mjs";
export class Checkpoints extends APIResource {
    constructor() {
        super(...arguments);
        this.permissions = new PermissionsAPI.Permissions(this._client);
    }
}
Checkpoints.Permissions = Permissions;
//# sourceMappingURL=checkpoints.mjs.map