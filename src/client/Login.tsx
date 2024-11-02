import { Navigate } from "react-router-dom";

type Props = {
  handleLogin: () => void;
  authenticated: boolean | null;
};
export const Login = ({ authenticated, handleLogin }: Props) => {
  return (
    <div>
      {authenticated === null && <div>Loading...</div>}
      {authenticated === false && (
        <div>
          <button onClick={() => handleLogin()}>Login</button>
        </div>
      )}
      {authenticated && <Navigate to="/callback" />}
    </div>
  );
};
