import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Callback } from "./Callback";
import { Root } from "./Root";

export const App = () => {
  return (
    <div>
      <p>app header</p>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
