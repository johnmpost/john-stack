import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Callback } from "./Callback";
import { Dash } from "./Dash";

export const App = () => {
  return (
    <div>
      <p>app header</p>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dash />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
