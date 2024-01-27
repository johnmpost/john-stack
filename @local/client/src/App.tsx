import { listTractors } from "@common/actions";
import { mkInvoke } from "@common/john-api";
import { useGetUsersQuery } from "@local/graphql";
import { useState } from "react";
import { Ef } from "../../common/exports";

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
