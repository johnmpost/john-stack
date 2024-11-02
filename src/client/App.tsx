import React, { useEffect, useState } from "react";
import { createZitadelAuth } from "@zitadel/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import Callback from "./Callback";
import { config } from "./exports";

export const App = () => {
  const zitadel = createZitadelAuth({
    authority: config.zitadelUrl,
    client_id: config.zitadelClientId,
    redirect_uri: "http://localhost:5002/callback",
    post_logout_redirect_uri: "http://localhost:5002/",
  });

  function login() {
    zitadel.authorize();
  }

  function signout() {
    zitadel.signout();
  }

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    zitadel.userManager.getUser().then(user => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [zitadel]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to ZITADEL React</p>

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Login authenticated={authenticated} handleLogin={login} />
              }
            />
            <Route
              path="/callback"
              element={
                <Callback
                  authenticated={authenticated}
                  setAuth={setAuthenticated}
                  handleLogout={signout}
                  userManager={zitadel.userManager}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
};
