import * as Effect from "../../Effect.js";
import type * as STM from "../../STM.js";
export declare const bind: (<N extends string, K, R2, E2, A>(tag: Exclude<N, keyof K>, f: (_: K) => STM.STM<R2, E2, A>) => <R, E>(self: STM.STM<R, E, K>) => STM.STM<R2 | R, E2 | E, Effect.MergeRecord<K, { [k in N]: A; }>>) & (<R_1, E_1, N_1 extends string, K_1, R2_1, E2_1, A_1>(self: STM.STM<R_1, E_1, K_1>, tag: Exclude<N_1, keyof K_1>, f: (_: K_1) => STM.STM<R2_1, E2_1, A_1>) => STM.STM<R_1 | R2_1, E_1 | E2_1, Effect.MergeRecord<K_1, { [k_1 in N_1]: A_1; }>>);
export declare const catchTag: (<K extends E["_tag"] & string, E extends {
    _tag: string;
}, R1, E1, A1>(k: K, f: (e: Extract<E, {
    _tag: K;
}>) => STM.STM<R1, E1, A1>) => <R, A>(self: STM.STM<R, E, A>) => STM.STM<R1 | R, E1 | Exclude<E, {
    _tag: K;
}>, A1 | A>) & (<R_1, E_1 extends {
    _tag: string;
}, A_1, K_1 extends E_1["_tag"] & string, R1_1, E1_1, A1_1>(self: STM.STM<R_1, E_1, A_1>, k: K_1, f: (e: Extract<E_1, {
    _tag: K_1;
}>) => STM.STM<R1_1, E1_1, A1_1>) => STM.STM<R_1 | R1_1, E1_1 | Exclude<E_1, {
    _tag: K_1;
}>, A_1 | A1_1>);
//# sourceMappingURL=stm.d.ts.map