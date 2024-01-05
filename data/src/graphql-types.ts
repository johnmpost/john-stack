import { GraphQLResolveInfo } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AlreadyExistsError = {
  __typename?: 'AlreadyExistsError';
  msg: Scalars['String']['output'];
};

export type Authentication = {
  __typename?: 'Authentication';
  token: Scalars['String']['output'];
  user: User;
};

export type CreatePostResult = DuplicateIdError | NotFoundError | Post | UnauthorizedError;

export type CreateThreadResult = DuplicateIdError | Thread | UnauthorizedError;

export type DuplicateIdError = {
  __typename?: 'DuplicateIdError';
  msg: Scalars['String']['output'];
};

export type EditPostResult = NotFoundError | Post | UnauthorizedError;

export type InvalidCredentialsError = {
  __typename?: 'InvalidCredentialsError';
  msg: Scalars['String']['output'];
};

export type LogInResult = Authentication | InvalidCredentialsError;

export enum Membership {
  Active = 'Active',
  Alum = 'Alum',
  New = 'New',
  Unassigned = 'Unassigned'
}

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<CreatePostResult>;
  createThread?: Maybe<CreateThreadResult>;
  editPost?: Maybe<EditPostResult>;
  logIn?: Maybe<LogInResult>;
  signUp?: Maybe<SignUpResult>;
};


export type MutationCreatePostArgs = {
  content: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  threadId: Scalars['ID']['input'];
};


export type MutationCreateThreadArgs = {
  content: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
  threadId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};


export type MutationEditPostArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationLogInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type NotFoundError = {
  __typename?: 'NotFoundError';
  msg: Scalars['String']['output'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  content: Scalars['String']['output'];
  date: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  thread: Thread;
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<Post>;
  thread?: Maybe<Thread>;
  threads: Array<Thread>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryThreadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum Role {
  Admin = 'Admin',
  Deactivated = 'Deactivated',
  Member = 'Member',
  Pending = 'Pending'
}

export type SignUpResult = AlreadyExistsError | Authentication | ValidationError;

export type Thread = {
  __typename?: 'Thread';
  creator: User;
  id: Scalars['ID']['output'];
  posts: Array<Post>;
  title: Scalars['String']['output'];
};

export type UnauthorizedError = {
  __typename?: 'UnauthorizedError';
  msg: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  membership: Membership;
  posts: Array<Post>;
  role: Role;
  threads: Array<User>;
};

export type ValidationError = {
  __typename?: 'ValidationError';
  msg: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  CreatePostResult: ( DuplicateIdError ) | ( NotFoundError ) | ( Post ) | ( UnauthorizedError );
  CreateThreadResult: ( DuplicateIdError ) | ( Thread ) | ( UnauthorizedError );
  EditPostResult: ( NotFoundError ) | ( Post ) | ( UnauthorizedError );
  LogInResult: ( Authentication ) | ( InvalidCredentialsError );
  SignUpResult: ( AlreadyExistsError ) | ( Authentication ) | ( ValidationError );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AlreadyExistsError: ResolverTypeWrapper<AlreadyExistsError>;
  Authentication: ResolverTypeWrapper<Authentication>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreatePostResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreatePostResult']>;
  CreateThreadResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateThreadResult']>;
  DuplicateIdError: ResolverTypeWrapper<DuplicateIdError>;
  EditPostResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['EditPostResult']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InvalidCredentialsError: ResolverTypeWrapper<InvalidCredentialsError>;
  LogInResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LogInResult']>;
  Membership: Membership;
  Mutation: ResolverTypeWrapper<{}>;
  NotFoundError: ResolverTypeWrapper<NotFoundError>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  SignUpResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SignUpResult']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Thread: ResolverTypeWrapper<Thread>;
  UnauthorizedError: ResolverTypeWrapper<UnauthorizedError>;
  User: ResolverTypeWrapper<User>;
  ValidationError: ResolverTypeWrapper<ValidationError>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AlreadyExistsError: AlreadyExistsError;
  Authentication: Authentication;
  Boolean: Scalars['Boolean']['output'];
  CreatePostResult: ResolversUnionTypes<ResolversParentTypes>['CreatePostResult'];
  CreateThreadResult: ResolversUnionTypes<ResolversParentTypes>['CreateThreadResult'];
  DuplicateIdError: DuplicateIdError;
  EditPostResult: ResolversUnionTypes<ResolversParentTypes>['EditPostResult'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  InvalidCredentialsError: InvalidCredentialsError;
  LogInResult: ResolversUnionTypes<ResolversParentTypes>['LogInResult'];
  Mutation: {};
  NotFoundError: NotFoundError;
  Post: Post;
  Query: {};
  SignUpResult: ResolversUnionTypes<ResolversParentTypes>['SignUpResult'];
  String: Scalars['String']['output'];
  Thread: Thread;
  UnauthorizedError: UnauthorizedError;
  User: User;
  ValidationError: ValidationError;
}>;

export type AlreadyExistsErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlreadyExistsError'] = ResolversParentTypes['AlreadyExistsError']> = ResolversObject<{
  msg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Authentication'] = ResolversParentTypes['Authentication']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatePostResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePostResult'] = ResolversParentTypes['CreatePostResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DuplicateIdError' | 'NotFoundError' | 'Post' | 'UnauthorizedError', ParentType, ContextType>;
}>;

export type CreateThreadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateThreadResult'] = ResolversParentTypes['CreateThreadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DuplicateIdError' | 'Thread' | 'UnauthorizedError', ParentType, ContextType>;
}>;

export type DuplicateIdErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['DuplicateIdError'] = ResolversParentTypes['DuplicateIdError']> = ResolversObject<{
  msg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPostResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['EditPostResult'] = ResolversParentTypes['EditPostResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotFoundError' | 'Post' | 'UnauthorizedError', ParentType, ContextType>;
}>;

export type InvalidCredentialsErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvalidCredentialsError'] = ResolversParentTypes['InvalidCredentialsError']> = ResolversObject<{
  msg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogInResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LogInResult'] = ResolversParentTypes['LogInResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Authentication' | 'InvalidCredentialsError', ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createPost?: Resolver<Maybe<ResolversTypes['CreatePostResult']>, ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'content' | 'id' | 'threadId'>>;
  createThread?: Resolver<Maybe<ResolversTypes['CreateThreadResult']>, ParentType, ContextType, RequireFields<MutationCreateThreadArgs, 'content' | 'postId' | 'threadId' | 'title'>>;
  editPost?: Resolver<Maybe<ResolversTypes['EditPostResult']>, ParentType, ContextType, RequireFields<MutationEditPostArgs, 'id'>>;
  logIn?: Resolver<Maybe<ResolversTypes['LogInResult']>, ParentType, ContextType, RequireFields<MutationLogInArgs, 'email' | 'password'>>;
  signUp?: Resolver<Maybe<ResolversTypes['SignUpResult']>, ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password'>>;
}>;

export type NotFoundErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotFoundError'] = ResolversParentTypes['NotFoundError']> = ResolversObject<{
  msg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  thread?: Resolver<Maybe<ResolversTypes['Thread']>, ParentType, ContextType, RequireFields<QueryThreadArgs, 'id'>>;
  threads?: Resolver<Array<ResolversTypes['Thread']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type SignUpResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignUpResult'] = ResolversParentTypes['SignUpResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AlreadyExistsError' | 'Authentication' | 'ValidationError', ParentType, ContextType>;
}>;

export type ThreadResolvers<ContextType = any, ParentType extends ResolversParentTypes['Thread'] = ResolversParentTypes['Thread']> = ResolversObject<{
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnauthorizedErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnauthorizedError'] = ResolversParentTypes['UnauthorizedError']> = ResolversObject<{
  msg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  membership?: Resolver<ResolversTypes['Membership'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  threads?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ValidationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ValidationError'] = ResolversParentTypes['ValidationError']> = ResolversObject<{
  msg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AlreadyExistsError?: AlreadyExistsErrorResolvers<ContextType>;
  Authentication?: AuthenticationResolvers<ContextType>;
  CreatePostResult?: CreatePostResultResolvers<ContextType>;
  CreateThreadResult?: CreateThreadResultResolvers<ContextType>;
  DuplicateIdError?: DuplicateIdErrorResolvers<ContextType>;
  EditPostResult?: EditPostResultResolvers<ContextType>;
  InvalidCredentialsError?: InvalidCredentialsErrorResolvers<ContextType>;
  LogInResult?: LogInResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotFoundError?: NotFoundErrorResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignUpResult?: SignUpResultResolvers<ContextType>;
  Thread?: ThreadResolvers<ContextType>;
  UnauthorizedError?: UnauthorizedErrorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
}>;


export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, membership: Membership, role: Role }> };


export const GetUsersDocument = gql`
    query GetUsers {
  users {
    id
    email
    membership
    role
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;