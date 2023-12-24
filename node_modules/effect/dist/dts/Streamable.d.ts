/**
 * @since 2.0.0
 */
import * as Stream from "./Stream.js";
/**
 * @since 2.0.0
 * @category constructors
 */
export declare abstract class Class<R, E, A> implements Stream.Stream<R, E, A> {
    /**
     * @since 2.0.0
     */
    readonly [Stream.StreamTypeId]: {
        _R: (_: never) => never;
        _E: (_: never) => never;
        _A: (_: never) => never;
    };
    /**
     * @since 2.0.0
     */
    pipe(): unknown;
    /**
     * @since 2.0.0
     */
    abstract toStream(): Stream.Stream<R, E, A>;
}
//# sourceMappingURL=Streamable.d.ts.map