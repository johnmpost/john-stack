import { useState } from "react";
import { helloWorld } from "@local/common/src/utils";
import { CreateTodo, GetTodo, GetTodos } from "@local/common/src/operations";
import { useQueryClient } from "@tanstack/react-query";
import { config, useMutation, useQuery } from "./exports";

export const App = () => {
  const [count, setCount] = useState(0);
  const queryClient = useQueryClient();
  const { data: todos } = useQuery(GetTodos)({})();
  const { data: todo } = useQuery(GetTodo)({ id: "dsiuiuio324" })();
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
            createTodo({ id: "543", description: "none", title: "Test Todo" })
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
