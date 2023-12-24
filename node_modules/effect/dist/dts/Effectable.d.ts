/**
 * @since 2.0.0
 */
import type * as Channel from "./Channel.js";
import type * as Effect from "./Effect.js";
import type * as Sink from "./Sink.js";
import type * as Stream from "./Stream.js";
/**
 * @since 2.0.0
 * @category type ids
 */
export declare const EffectTypeId: Effect.EffectTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
export type EffectTypeId = Effect.EffectTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
export declare const StreamTypeId: Stream.StreamTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
export type StreamTypeId = Stream.StreamTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
export declare const SinkTypeId: Sink.SinkTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
export type SinkTypeId = Sink.SinkTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
export declare const ChannelTypeId: Channel.ChannelTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
export type ChannelTypeId = Channel.ChannelTypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface CommitPrimitive {
    new <R, E, A>(): Effect.Effect<R, E, A>;
}
/**
 * @since 2.0.0
 * @category prototypes
 */
export declare const EffectPrototype: Effect.Effect<never, never, never>;
/**
 * @since 2.0.0
 * @category prototypes
 */
export declare const CommitPrototype: Effect.Effect<never, never, never>;
/**
 * @since 2.0.0
 * @category prototypes
 */
export declare const StructuralCommitPrototype: Effect.Effect<never, never, never>;
declare const Base: CommitPrimitive;
declare const StructuralBase: CommitPrimitive;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare abstract class Class<R, E, A> extends Base<R, E, A> {
    /**
     * @since 2.0.0
     */
    abstract commit(): Effect.Effect<R, E, A>;
}
/**
 * @since 2.0.0
 * @category constructors
 */
export declare abstract class StructuralClass<R, E, A> extends StructuralBase<R, E, A> {
    /**
     * @since 2.0.0
     */
    abstract commit(): Effect.Effect<R, E, A>;
}
export {};
//# sourceMappingURL=Effectable.d.ts.map