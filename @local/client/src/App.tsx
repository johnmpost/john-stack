import { useState } from "react";
import { config } from "./config";
import { helloWorld } from "@local/common/src/utils";
import { mkUseQuery } from "@local/common/src/johnapi";
import { GetTodo, GetTodos } from "@local/common/src/operations";

const useQuery = mkUseQuery(config.CLIENT_WEB_FUNCTIONS_URL);

export const App = () => {
  const [count, setCount] = useState(0);
  const { data: todos, error } = useQuery(GetTodos)({})({});
  const { data: todo, error: err } = useQuery(GetTodo)({ id: "dsiuiuio324" })(
    {},
  );

  return (
    <>
      <h1>john-stack-client</h1>
      <h3>{helloWorld}</h3>
      <h3>{config.CLIENT_WEB_FUNCTIONS_URL}</h3>
      <div>
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
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
