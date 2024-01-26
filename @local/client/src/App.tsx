import { signUpUser } from "@common/actions";
import { networkError } from "@common/errors";
import { mkInvoke } from "@common/john-api";
import { useGetUsersQuery } from "@local/graphql";
import { useState } from "react";
import { Ef } from "../../common/exports";

const invoke = mkInvoke("http://localhost:4000/action");

function App() {
  const [count, setCount] = useState(0);
  // const { data: _ } = useGetUsersQuery();

  return (
    <>
      <h1>john-stack-client</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button
          onClick={() =>
            invoke(signUpUser)({ kind: "signUpUser", email: "", password: "" })
              .pipe(Ef.runPromise)
              .then(console.log)
          }
        >
          test api
        </button>
        <p>{JSON.stringify(networkError)}</p>
      </div>
    </>
  );
}

export default App;
