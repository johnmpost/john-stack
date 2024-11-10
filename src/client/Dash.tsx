import { useQuery } from "@tanstack/react-query";
import { zitadel } from "./exports";
import { useEffect } from "react";

export const Dash = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return zitadel.userManager.getUser();
    },
  });

  useEffect(() => {
    if (user === null) {
      zitadel.authorize();
    }
  }, [user]);

  return user === null ? (
    <div>not logged in. redirecting...</div>
  ) : user === undefined ? (
    <div>loading...</div>
  ) : (
    <div>
      <p>signed in, app goes here</p>
      <p>welcome {user.profile.email}</p>
      <button onClick={() => zitadel.signout()}>sign out</button>
    </div>
  );
};
