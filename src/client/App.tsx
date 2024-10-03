import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { v7 as uuidv7 } from "uuid";
import { helloWorld } from "../common/utils";
import { CreateTodo, GetTodo, GetTodos } from "../common/actions";
import { config, useMutation, useQuery } from "./exports";
import { Card, Stack, Typography } from "@mui/joy";

export const App = () => {
  const [count, setCount] = useState(0);
  const queryClient = useQueryClient();
  const { data: todos } = useQuery(GetTodos)({})();
  const { data: todo } = useQuery(GetTodo)({
    id: "019249e4-3d6e-7744-b33d-a5ccf47ca4a5",
  })();
  const { mutate: createTodo } = useMutation(CreateTodo)({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: GetTodos.mkQueryKey({}) }),
  });

  return (
    <>
      <h1>john-stack-client</h1>
      <h3>{helloWorld}</h3>
      <h3>{config.restlessServerUrl}</h3>
      <div>
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <button
          onClick={() =>
            createTodo({
              id: uuidv7(),
              description: "none",
              title: "Test Todo",
            })
          }
        >
          create todo
        </button>
      </div>
      <Stack spacing={1}>
        {todos ? (
          todos.map(todo => (
            <Card key={todo.id}>
              <Typography level="title-lg">{todo.title}</Typography>
              <Typography level="body-md">{todo.description}</Typography>
            </Card>
          ))
        ) : (
          <></>
        )}
      </Stack>
    </>
  );
};
