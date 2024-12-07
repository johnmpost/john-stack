import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "./exports";
import { CreateTodo, DeleteTodo, GetTodos } from "../common/actions";
import { v7 as uuidv7 } from "uuid";
import { User } from "oidc-client-ts";
import { zitadel } from "./exports";
import { match } from "ts-pattern";
import { Card } from "@mui/joy";
import { faker } from "@faker-js/faker";

type Props = { user: User };

export const Dash = ({ user }: Props) => {
  const queryClient = useQueryClient();

  const { data: todos } = useQuery(GetTodos)({
    accessToken: user.access_token,
  })({});

  const { mutate: createTodo } = useMutation(CreateTodo)({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const { mutate: deleteTodo } = useMutation(DeleteTodo)({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return (
    <div>
      <p>welcome {user.profile.email}</p>
      <p>{user.access_token}</p>
      {todos === undefined ? (
        <div>loading todos...</div>
      ) : (
        todos.map(todo => (
          <Card key={todo.id}>
            <div>{todo.title}</div>
            <div>{todo.description}</div>
            <button
              onClick={() =>
                deleteTodo({ todoId: todo.id, accessToken: user.access_token })
              }
            >
              delete
            </button>
          </Card>
        ))
      )}
      <button
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
      </button>
      <button onClick={() => zitadel.signout()}>sign out</button>
    </div>
  );
};
