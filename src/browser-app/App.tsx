import { Route, Routes, useLocation } from "react-router-dom";
import { Callback } from "./Callback";
import { Dash } from "./Dash";
import { useRequirements } from "./requirements";
import { match, P } from "ts-pattern";
import { Todo } from "./Todo";

export const App = () => {
  return (
    <div>
      <p>app header</p>
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<Dash />} />
      </Routes>
    </div>
  );
};
