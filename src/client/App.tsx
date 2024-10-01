import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { v7 as uuidv7 } from "uuid";
import { helloWorld } from "../common/utils";
import { CreateTodo, GetTodo, GetTodos } from "../common/actions";
import { config, useMutation, useQuery } from "./exports";

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
      <div>
        {todos ? (
          todos.map((todo, i) => <div key={i}>{todo.title}</div>)
        ) : (
          <div>loading todos...</div>
        )}
        {todo ? <div>{todo.title}</div> : <div>loading single todo...</div>}
      </div>
    </>
  );
};
