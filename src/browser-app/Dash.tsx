import { useQueryClient } from "@tanstack/react-query";
import { CreateTodo, DeleteTodo, GetTodos } from "../common/actions";
import { v7 as uuidv7 } from "uuid";
import { User } from "oidc-client-ts";
import { Card } from "@mui/joy";
import { faker } from "@faker-js/faker";
import { useRequirements } from "./requirements";
import { Link } from "react-router-dom";

export const Dash = () => {
  const queryClient = useQueryClient();
  const { zitadel, useMutation, useQuery, useUser } = useRequirements();

  const user = useUser(true);

  const useDependentQuery =
    <T, U>(dependency: T | undefined) =>
    (query: (t: T) => U) => {
      return dependency ? query(dependency) : undefined;
    };

  const { data: todos } = useDependentQuery(user)(user =>
    useQuery(GetTodos)({
      accessToken: user.access_token,
    }),
  );

  const { mutate: createTodo } = useMutation(CreateTodo)({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const { mutate: deleteTodo } = useMutation(DeleteTodo)({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return (
    <div>
      <p>welcome {user?.profile.email ?? "loading user..."}</p>
      {todos === undefined ? (
        <div>loading todos...</div>
      ) : (
        todos.map(todo => (
          <Card key={todo.id}>
            <Link to={`/todo/${todo.id}`}>{todo.title}</Link>
            <div>{todo.description}</div>
            {/* <button
              onClick={() =>
                deleteTodo({ todoId: todo.id, accessToken: user.access_token })
              }
            >
              delete
            </button> */}
          </Card>
        ))
      )}
      {/* <button
        onClick={() =>
          createTodo({
            todo: {
              id: uuidv7(),
              title: `${faker.hacker.verb()} the ${faker.hacker.noun()}`,
              description: faker.hacker.phrase(),
            },
            accessToken: user.access_token,
          })
        }
      >
        create new todo
      </button> */}
      <button onClick={() => zitadel.signout()}>sign out</button>
    </div>
  );
};
