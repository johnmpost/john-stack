import { useGetUsersQuery } from "@local/graphql";
import { useState } from "react";
import * as Ef from "effect/Effect";
import { listTractors } from "@local/common/actions";
import { mkInvoke } from "@local/common/johnapi";

const invoke = mkInvoke("http://localhost:4000/action");

function App() {
  const [count, setCount] = useState(0);
  const { data: _ } = useGetUsersQuery();

  return (
    <>
      <h1>john-stack-client</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button
          onClick={() =>
            invoke(listTractors)({ kind: "listTractors" })
              .pipe(Ef.runPromise)
              .then(console.log)
          }
        >
          test api
        </button>
      </div>
    </>
  );
}

export default App;
