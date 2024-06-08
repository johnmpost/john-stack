import { useState } from "react";
import { config } from "./config";
import { helloWorld } from "@local/common/src/utils";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>john-stack-client</h1>
      <h3>{helloWorld}</h3>
      <h3>{config.CLIENT_APOLLO_URL}</h3>
      <div>
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
