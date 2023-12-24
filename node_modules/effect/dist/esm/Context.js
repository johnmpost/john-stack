import * as internal from "./internal/context.js";
const TagTypeId = internal.TagTypeId;
/**
 * Creates a new `Tag` instance with an optional key parameter.
 *
 * Specifying the `key` will make the `Tag` global, meaning two tags with the same
 * key will map to the same instance.
 *
 * Note: this is useful for cases where live reload can happen and it is
 * desireable to preserve the instance across reloads.
 *
 * @param key - An optional key that makes the `Tag` global.
 *
 * @example
 * import * as Context from "effect/Context"
 *
 * assert.strictEqual(Context.Tag() === Context.Tag(), false)
 * assert.strictEqual(Context.Tag("PORT") === Context.Tag("PORT"), true)
 *
 * @since 2.0.0
 * @category constructors
 */
export const Tag = internal.makeTag;
const TypeId = internal.TypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
export const unsafeMake = internal.makeContext;
/**
 * Checks if the provided argument is a `Context`.
 *
 * @param input - The value to be checked if it is a `Context`.
 *
 * @example
 * import * as Context from "effect/Context"
 *
 * assert.strictEqual(Context.isContext(Context.empty()), true)
 *
 * @since 2.0.0
 * @category guards
 */
export const isContext = internal.isContext;
/**
 * Checks if the provided argument is a `Tag`.
 *
 * @param input - The value to be checked if it is a `Tag`.
 *
 * @example
 * import * as Context from "effect/Context"
 *
 * assert.strictEqual(Context.isTag(Context.Tag()), true)
 *
 * @since 2.0.0
 * @category guards
 */
export const isTag = internal.isTag;
/**
 * Returns an empty `Context`.
 *
 * @example
 * import * as Context from "effect/Context"
 *
 * assert.strictEqual(Context.isContext(Context.empty()), true)
 *
 * @since 2.0.0
 * @category constructors
 */
export const empty = internal.empty;
/**
 * Creates a new `Context` with a single service associated to the tag.
 *
 * @example
 * import * as Context from "effect/Context"
 *
 * const Port = Context.Tag<{ PORT: number }>()
 *
 * const Services = Context.make(Port, { PORT: 8080 })
 *
 * assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
 *
 * @since 2.0.0
 * @category constructors
 */
export const make = internal.make;
/**
 * Adds a service to a given `Context`.
 *
 * @example
 * import * as Context from "effect/Context"
 * import { pipe } from "effect/Function"
 *
 * const Port = Context.Tag<{ PORT: number }>()
 * const Timeout = Context.Tag<{ TIMEOUT: number }>()
 *
 * const someContext = Context.make(Port, { PORT: 8080 })
 *
 * const Services = pipe(
 *   someContext,
 *   Context.add(Timeout, { TIMEOUT: 5000 })
 * )
 *
 * assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
 * assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
 *
 * @since 2.0.0
 */
export const add = internal.add;
/**
 * Get a service from the context that corresponds to the given tag.
 *
 * @param self - The `Context` to search for the service.
 * @param tag - The `Tag` of the service to retrieve.
 *
 * @example
 * import * as Context from "effect/Context"
 * import { pipe } from "effect/Function"
 *
 * const Port = Context.Tag<{ PORT: number }>()
 * const Timeout = Context.Tag<{ TIMEOUT: number }>()
 *
 * const Services = pipe(
 *   Context.make(Port, { PORT: 8080 }),
 *   Context.add(Timeout, { TIMEOUT: 5000 })
 * )
 *
 * assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
 *
 * @since 2.0.0
 * @category getters
 */
export const get = internal.get;
/**
 * Get a service from the context that corresponds to the given tag.
 * This function is unsafe because if the tag is not present in the context, a runtime error will be thrown.
 *
 * For a safer version see {@link getOption}.
 *
 * @param self - The `Context` to search for the service.
 * @param tag - The `Tag` of the service to retrieve.
 *
 * @example
 * import * as Context from "effect/Context"
 *
 * const Port = Context.Tag<{ PORT: number }>()
 * const Timeout = Context.Tag<{ TIMEOUT: number }>()
 *
 * const Services = Context.make(Port, { PORT: 8080 })
 *
 * assert.deepStrictEqual(Context.unsafeGet(Services, Port), { PORT: 8080 })
 * assert.throws(() => Context.unsafeGet(Services, Timeout))
 *
 * @since 2.0.0
 * @category unsafe
 */
export const unsafeGet = internal.unsafeGet;
/**
 * Get the value associated with the specified tag from the context wrapped in an `Option` object. If the tag is not
 * found, the `Option` object will be `None`.
 *
 * @param self - The `Context` to search for the service.
 * @param tag - The `Tag` of the service to retrieve.
 *
 * @example
 * import * as Context from "effect/Context"
 * import * as O from "effect/Option"
 *
 * const Port = Context.Tag<{ PORT: number }>()
 * const Timeout = Context.Tag<{ TIMEOUT: number }>()
 *
 * const Services = Context.make(Port, { PORT: 8080 })
 *
 * assert.deepStrictEqual(Context.getOption(Services, Port), O.some({ PORT: 8080 }))
 * assert.deepStrictEqual(Context.getOption(Services, Timeout), O.none())
 *
 * @since 2.0.0
 * @category getters
 */
export const getOption = internal.getOption;
/**
 * Merges two `Context`s, returning a new `Context` containing the services of both.
 *
 * @param self - The first `Context` to merge.
 * @param that - The second `Context` to merge.
 *
 * @example
 * import * as Context from "effect/Context"
 *
 * const Port = Context.Tag<{ PORT: number }>()
 * const Timeout = Context.Tag<{ TIMEOUT: number }>()
 *
 * const firstContext = Context.make(Port, { PORT: 8080 })
 * const secondContext = Context.make(Timeout, { TIMEOUT: 5000 })
 *
 * const Services = Context.merge(firstContext, secondContext)
 *
 * assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
 * assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
 *
 * @since 2.0.0
 */
export const merge = internal.merge;
/**
 * Returns a new `Context` that contains only the specified services.
 *
 * @param self - The `Context` to prune services from.
 * @param tags - The list of `Tag`s to be included in the new `Context`.
 *
 * @example
 * import * as Context from "effect/Context"
 * import { pipe } from "effect/Function"
 * import * as O from "effect/Option"
 *
 * const Port = Context.Tag<{ PORT: number }>()
 * const Timeout = Context.Tag<{ TIMEOUT: number }>()
 *
 * const someContext = pipe(
 *   Context.make(Port, { PORT: 8080 }),
 *   Context.add(Timeout, { TIMEOUT: 5000 })
 * )
 *
 * const Services = pipe(someContext, Context.pick(Port))
 *
 * assert.deepStrictEqual(Context.getOption(Services, Port), O.some({ PORT: 8080 }))
 * assert.deepStrictEqual(Context.getOption(Services, Timeout), O.none())
 *
 * @since 2.0.0
 */
export const pick = internal.pick;
/**
 * @since 2.0.0
 */
export const omit = internal.omit;
//# sourceMappingURL=Context.js.map