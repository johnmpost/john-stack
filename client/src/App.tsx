import { networkError } from "@common/errors";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

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
