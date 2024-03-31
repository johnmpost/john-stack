import { useGetUsersQuery } from "@local/graphql";
import { useState } from "react";
import * as Ef from "effect/Effect";
import { helloWorld } from "@local/common/src/utils";
// import { listTractors } from "@local/common/actions";
// import { mkInvoke } from "@local/common/johnapi";

// const invoke = mkInvoke("http://localhost:4000/action");

function App() {
  const [count, setCount] = useState(0);
  const { data: _ } = useGetUsersQuery();

  return (
    <>
      <h1>john-stack-client</h1>
      <h3>{helloWorld}</h3>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button
        // onclick={() =>
        //   invoke(listtractors)({ kind: "listtractors" })
        //     .pipe(ef.runpromise)
        //     .then(console.log)
        // }
        >
          test api
        </button>
      </div>
    </>
  );
}

export default App;
