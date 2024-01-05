import { networkError } from "@common/errors";
import { useGetUsersQuery } from "@local/graphql";
import { useState } from "react";

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
        <p>{JSON.stringify(networkError)}</p>
      </div>
    </>
  );
}

export default App;
