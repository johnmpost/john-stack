/**
 * @since 2.0.0
 */
import * as Context from "./Context.js";
import type * as DefaultServices from "./DefaultServices.js";
import * as Effect from "./Effect.js";
import type * as Fiber from "./Fiber.js";
import type * as FiberRef from "./FiberRef.js";
import type * as Layer from "./Layer.js";
import type * as Scope from "./Scope.js";
import type * as SortedSet from "./SortedSet.js";
import type * as TestAnnotation from "./TestAnnotation.js";
import * as Annotations from "./TestAnnotations.js";
import * as TestConfig from "./TestConfig.js";
import * as Live from "./TestLive.js";
import * as Sized from "./TestSized.js";
/**
 * @since 2.0.0
 */
export type TestServices = Annotations.TestAnnotations | Live.TestLive | Sized.TestSized | TestConfig.TestConfig;
/**
 * The default Effect test services.
 *
 * @since 2.0.0
 */
export declare const liveServices: Context.Context<TestServices>;
/**
 * @since 2.0.0
 */
export declare const currentServices: FiberRef.FiberRef<Context.Context<TestServices>>;
/**
 * Retrieves the `Annotations` service for this test.
 *
 * @since 2.0.0
 */
export declare const annotations: () => Effect.Effect<never, never, Annotations.TestAnnotations>;
/**
 * Retrieves the `Annotations` service for this test and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 */
export declare const annotationsWith: <R, E, A>(f: (annotations: Annotations.TestAnnotations) => Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>;
/**
 * Executes the specified workflow with the specified implementation of the
 * annotations service.
 *
 * @since 2.0.0
 */
export declare const withAnnotations: ((annotations: Annotations.TestAnnotations) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>) & (<R_1, E_1, A_1>(effect: Effect.Effect<R_1, E_1, A_1>, annotations: Annotations.TestAnnotations) => Effect.Effect<R_1, E_1, A_1>);
/**
 * Sets the implementation of the annotations service to the specified value
 * and restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 */
export declare const withAnnotationsScoped: (annotations: Annotations.TestAnnotations) => Effect.Effect<Scope.Scope, never, void>;
/**
 * Constructs a new `Annotations` service wrapped in a layer.
 *
 * @since 2.0.0
 */
export declare const annotationsLayer: () => Layer.Layer<never, never, Annotations.TestAnnotations>;
/**
 * Accesses an `Annotations` instance in the context and retrieves the
 * annotation of the specified type, or its default value if there is none.
 *
 * @since 2.0.0
 */
export declare const get: <A>(key: TestAnnotation.TestAnnotation<A>) => Effect.Effect<never, never, A>;
/**
 * Accesses an `Annotations` instance in the context and appends the
 * specified annotation to the annotation map.
 *
 * @since 2.0.0
 */
export declare const annotate: <A>(key: TestAnnotation.TestAnnotation<A>, value: A) => Effect.Effect<never, never, void>;
/**
 * Returns the set of all fibers in this test.
 *
 * @since 2.0.0
 */
export declare const supervisedFibers: () => Effect.Effect<never, never, SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>>;
/**
 * Retrieves the `Live` service for this test and uses it to run the specified
 * workflow.
 *
 * @since 2.0.0
 */
export declare const liveWith: <R, E, A>(f: (live: Live.TestLive) => Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>;
/**
 * Retrieves the `Live` service for this test.
 *
 * @since 2.0.0
 */
export declare const live: Effect.Effect<never, never, Live.TestLive>;
/**
 * Executes the specified workflow with the specified implementation of the
 * live service.
 *
 * @since 2.0.0
 */
export declare const withLive: ((live: Live.TestLive) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>) & (<R_1, E_1, A_1>(effect: Effect.Effect<R_1, E_1, A_1>, live: Live.TestLive) => Effect.Effect<R_1, E_1, A_1>);
/**
 * Sets the implementation of the live service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 */
export declare const withLiveScoped: (live: Live.TestLive) => Effect.Effect<Scope.Scope, never, void>;
/**
 * Constructs a new `Live` service wrapped in a layer.
 *
 * @since 2.0.0
 */
export declare const liveLayer: () => Layer.Layer<DefaultServices.DefaultServices, never, Live.TestLive>;
/**
 * Provides a workflow with the "live" default Effect services.
 *
 * @since 2.0.0
 */
export declare const provideLive: <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>;
/**
 * Runs a transformation function with the live default Effect services while
 * ensuring that the workflow itself is run with the test services.
 *
 * @since 2.0.0
 */
export declare const provideWithLive: (<R, E, A, R2, E2, A2>(f: (effect: Effect.Effect<R, E, A>) => Effect.Effect<R2, E2, A2>) => (self: Effect.Effect<R, E, A>) => Effect.Effect<R | R2, E | E2, A2>) & (<R_1, E_1, A_1, R2_1, E2_1, A2_1>(self: Effect.Effect<R_1, E_1, A_1>, f: (effect: Effect.Effect<R_1, E_1, A_1>) => Effect.Effect<R2_1, E2_1, A2_1>) => Effect.Effect<R_1 | R2_1, E_1 | E2_1, A2_1>);
/**
 * Retrieves the `Sized` service for this test and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 */
export declare const sizedWith: <R, E, A>(f: (sized: Sized.TestSized) => Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>;
/**
 * Retrieves the `Sized` service for this test.
 *
 * @since 2.0.0
 */
export declare const sized: Effect.Effect<never, never, Sized.TestSized>;
/**
 * Executes the specified workflow with the specified implementation of the
 * sized service.
 *
 * @since 2.0.0
 */
export declare const withSized: ((sized: Sized.TestSized) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>) & (<R_1, E_1, A_1>(effect: Effect.Effect<R_1, E_1, A_1>, sized: Sized.TestSized) => Effect.Effect<R_1, E_1, A_1>);
/**
 * Sets the implementation of the sized service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 */
export declare const withSizedScoped: (sized: Sized.TestSized) => Effect.Effect<Scope.Scope, never, void>;
/**
 * @since 2.0.0
 */
export declare const sizedLayer: (size: number) => Layer.Layer<never, never, Sized.TestSized>;
/**
 * @since 2.0.0
 */
export declare const size: Effect.Effect<never, never, number>;
/**
 * @since 2.0.0
 */
export declare const withSize: ((size: number) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>) & (<R_1, E_1, A_1>(effect: Effect.Effect<R_1, E_1, A_1>, size: number) => Effect.Effect<R_1, E_1, A_1>);
/**
 * Retrieves the `TestConfig` service for this test and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 */
export declare const testConfigWith: <R, E, A>(f: (config: TestConfig.TestConfig) => Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>;
/**
 * Retrieves the `TestConfig` service for this test.
 *
 * @since 2.0.0
 */
export declare const testConfig: Effect.Effect<never, never, TestConfig.TestConfig>;
/**
 * Executes the specified workflow with the specified implementation of the
 * config service.
 *
 * @since 2.0.0
 */
export declare const withTestConfig: ((config: TestConfig.TestConfig) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>) & (<R_1, E_1, A_1>(effect: Effect.Effect<R_1, E_1, A_1>, config: TestConfig.TestConfig) => Effect.Effect<R_1, E_1, A_1>);
/**
 * Sets the implementation of the config service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 */
export declare const withTestConfigScoped: (config: TestConfig.TestConfig) => Effect.Effect<Scope.Scope, never, void>;
/**
 * Constructs a new `TestConfig` service with the specified settings.
 *
 * @since 2.0.0
 */
export declare const testConfigLayer: (params: {
    readonly repeats: number;
    readonly retries: number;
    readonly samples: number;
    readonly shrinks: number;
}) => Layer.Layer<never, never, TestConfig.TestConfig>;
/**
 * The number of times to repeat tests to ensure they are stable.
 *
 * @since 2.0.0
 */
export declare const repeats: Effect.Effect<never, never, number>;
/**
 * The number of times to retry flaky tests.
 *
 * @since 2.0.0
 */
export declare const retries: Effect.Effect<never, never, number>;
/**
 * The number of sufficient samples to check for a random variable.
 *
 * @since 2.0.0
 */
export declare const samples: Effect.Effect<never, never, number>;
/**
 * The maximum number of shrinkings to minimize large failures.
 *
 * @since 2.0.0
 */
export declare const shrinks: Effect.Effect<never, never, number>;
//# sourceMappingURL=TestServices.d.ts.map