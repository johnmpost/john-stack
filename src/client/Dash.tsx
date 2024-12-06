import {
  useQuery as usePromiseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMutation, useQuery, zitadel } from "./exports";
import { useEffect } from "react";
import { CreateTodo, GetTodos } from "../common/actions";
import { v7 } from "uuid";

export const Dash = () => {
  const queryClient = useQueryClient();
  const { data: user } = usePromiseQuery({
    queryKey: ["user"],
    queryFn: () => zitadel.userManager.getUser(),
  });

  const { data: todos } = useQuery(GetTodos)({
    accessToken: user?.access_token as string,
  })({
    enabled: user?.access_token !== undefined,
  });

  const { mutate: createTodo } = useMutation(CreateTodo)({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  useEffect(() => {
    if (user === null || user?.expired) {
      zitadel.authorize();
    }
  }, [user]);

  return user === null ? (
    <div>not logged in. redirecting...</div>
  ) : user === undefined ? (
    <div>loading...</div>
  ) : (
    <div>
      <p>signed in, app goes here</p>
      <p>welcome {user.profile.email}</p>
      <p>{user.access_token}</p>
      {todos && <pre>{JSON.stringify(todos, null, 2)}</pre>}
      <button
        onClick={() =>
          createTodo({
            todo: { id: v7(), description: "new todo desc", title: "new todo" },
            accessToken: user.access_token,
          })
        }
      >
        create new todo
      </button>
      <button onClick={() => zitadel.signout()}>sign out</button>
    </div>
  );
};
