import { useQuery as usePromiseQuery } from "@tanstack/react-query";
import { useQuery, zitadel } from "./exports";
import { useEffect } from "react";
import { DiscoverMe } from "../common/actions";

export const Dash = () => {
  const { data: user } = usePromiseQuery({
    queryKey: ["user"],
    queryFn: () => zitadel.userManager.getUser(),
  });

  const { data: whoami } = useQuery(DiscoverMe)({
    accessToken: user?.access_token as string,
  })({
    enabled: user?.access_token !== undefined,
  });

  useEffect(() => {
    if (user === null || user?.expired) {
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
      <p>{user.access_token}</p>
      {whoami && <pre>{JSON.stringify(JSON.parse(whoami), null, 2)}</pre>}
      <button onClick={() => zitadel.signout()}>sign out</button>
    </div>
  );
};
