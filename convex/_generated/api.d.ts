/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as appSettings from "../appSettings.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as http from "../http.js";
import type * as mediaItemMutations from "../mediaItemMutations.js";
import type * as mediaItemQueries from "../mediaItemQueries.js";
import type * as storage from "../storage.js";
import type * as subcategories from "../subcategories.js";
import type * as trash from "../trash.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  appSettings: typeof appSettings;
  auth: typeof auth;
  categories: typeof categories;
  http: typeof http;
  mediaItemMutations: typeof mediaItemMutations;
  mediaItemQueries: typeof mediaItemQueries;
  storage: typeof storage;
  subcategories: typeof subcategories;
  trash: typeof trash;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
