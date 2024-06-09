import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Ef, flow } from "@local/common/src/toolbox";
import type {
  QueryFunctionContext,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export interface UseEffectQuery<A, E, A2 = A, K extends QueryKey = QueryKey>
  extends Omit<UseQueryOptions<A, E, A2, K>, "queryFn"> {
  queryKey: K;
  queryFn: (context: QueryFunctionContext<K>) => Ef.Effect<A, E>;
}

export interface UseEffectMutation<A, E, P, C>
  extends Omit<UseMutationOptions<A, E, P, C>, "mutationFn"> {
  mutationFn: (params: P) => Ef.Effect<A, E>;
}

export function useEffectQuery<A, E, A2 = A, K extends QueryKey = QueryKey>({
  queryFn,
  queryKey,
  ...opts
}: UseEffectQuery<A, E, A2, K>) {
  return useQuery<A, E, A2, K>({
    queryKey,
    queryFn: flow(queryFn, Ef.runPromise, x => (console.log(x), x)),
    ...opts,
  });
}

export function useEffectSuspenseQuery<
  A,
  E,
  A2 = A,
  K extends QueryKey = QueryKey,
>({ queryFn, queryKey, ...opts }: UseEffectQuery<A, E, A2, K>) {
  return useSuspenseQuery<A, E, A2, K>({
    queryKey,
    queryFn: flow(queryFn, Ef.runPromise),
    ...opts,
  });
}

export function useEffectMutation<A, E, P, C>({
  mutationFn,
  ...opts
}: UseEffectMutation<A, E, P, C>) {
  return useMutation<A, E, P, C>({
    mutationFn: flow(mutationFn, Ef.runPromise),
    ...opts,
  });
}
