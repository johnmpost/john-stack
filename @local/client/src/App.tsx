import { useState } from "react";
import { config } from "./config";
import { helloWorld } from "@local/common/src/utils";
import { useInvoke } from "./InvokeContext";
import { useEffectQuery } from "./query-utils";
import { GetTodos } from "@local/common/src/web-functions";

export const App = () => {
  const [count, setCount] = useState(0);
  const invoke = useInvoke();
  const { data: todos } = useEffectQuery({
    queryKey: ["todos"],
    queryFn: () => invoke(GetTodos)({}),
  });
  console.log(todos);

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
      </div>
    </>
  );
};
