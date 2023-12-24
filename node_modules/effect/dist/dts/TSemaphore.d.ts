/**
 * @since 2.0.0
 */
import type * as Effect from "./Effect.js";
import type * as Scope from "./Scope.js";
import type * as STM from "./STM.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const TSemaphoreTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type TSemaphoreTypeId = typeof TSemaphoreTypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface TSemaphore extends TSemaphore.Proto {
}
/**
 * @since 2.0.0
 */
export declare namespace TSemaphore {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Proto {
        readonly [TSemaphoreTypeId]: TSemaphoreTypeId;
    }
}
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const acquire: (self: TSemaphore) => STM.STM<never, never, void>;
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const acquireN: {
    (n: number): (self: TSemaphore) => STM.STM<never, never, void>;
    (self: TSemaphore, n: number): STM.STM<never, never, void>;
};
/**
 * @since 2.0.0
 * @category getters
 */
export declare const available: (self: TSemaphore) => STM.STM<never, never, number>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const make: (permits: number) => STM.STM<never, never, TSemaphore>;
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const release: (self: TSemaphore) => STM.STM<never, never, void>;
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const releaseN: {
    (n: number): (self: TSemaphore) => STM.STM<never, never, void>;
    (self: TSemaphore, n: number): STM.STM<never, never, void>;
};
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const withPermit: {
    (semaphore: TSemaphore): <R, E, A>(self: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>;
    <R, E, A>(self: Effect.Effect<R, E, A>, semaphore: TSemaphore): Effect.Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const withPermits: {
    (semaphore: TSemaphore, permits: number): <R, E, A>(self: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>;
    <R, E, A>(self: Effect.Effect<R, E, A>, semaphore: TSemaphore, permits: number): Effect.Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const withPermitScoped: (self: TSemaphore) => Effect.Effect<Scope.Scope, never, void>;
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const withPermitsScoped: {
    (permits: number): (self: TSemaphore) => Effect.Effect<Scope.Scope, never, void>;
    (self: TSemaphore, permits: number): Effect.Effect<Scope.Scope, never, void>;
};
/**
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeMake: (permits: number) => TSemaphore;
//# sourceMappingURL=TSemaphore.d.ts.map