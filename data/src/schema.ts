export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    content: String!
    author: User!
    thread: Thread!
  }

  type Thread {
    id: ID!
    title: String!
    posts: [Post!]!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    threads: [Thread!]!
    thread(id: ID!): Thread
    posts: [Post!]!
    post(id: ID!): Post
  }
`;

type User = {
  id: string;
  username: string;
};

type Post = {
  id: string;
  content: string;
  authorId: string;
  threadId: string;
};

type Thread = {
  id: string;
  title: string;
};

const users: User[] = [
  { id: "1", username: "Alice" },
  { id: "2", username: "Bob" },
];

const threads: Thread[] = [
  { id: "1", title: "Introduction Thread" },
  { id: "2", title: "Random Discussion" },
];

const posts: Post[] = [
  { id: "1", content: "Hello, everyone!", authorId: "1", threadId: "1" },
  { id: "2", content: "Welcome to the forum!", authorId: "2", threadId: "1" },
];

export const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find((user) => user.id === id),
    threads: () => threads,
    thread: (_, { id }) => threads.find((thread) => thread.id === id),
    posts: () => posts,
    post: (_, { id }) => posts.find((post) => post.id === id),
  },
  User: {
    posts: (user) => posts.filter((post) => post.authorId === user.id),
  },
  Post: {
    author: (post) => users.find((user) => user.id === post.authorId),
    thread: (post) => threads.find((thread) => thread.id === post.threadId),
  },
  Thread: {
    posts: (thread) => posts.filter((post) => post.threadId === thread.id),
  },
};
