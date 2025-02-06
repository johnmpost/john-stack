import { useQuery as usePromiseQuery } from "@tanstack/react-query";
import { zitadel } from "./exports";
import { useEffect } from "react";
import { Dash } from "./Dash";
import { match } from "ts-pattern";

export const Root = () => {
  const { data: user } = usePromiseQuery({
    queryKey: ["user"],
    queryFn: () => zitadel.userManager.getUser(),
  });

  useEffect(() => {
    if (user === null || user?.expired) {
      zitadel.authorize();
    }
  }, [user]);

  return match(user)
    .with(undefined, () => <div>loading app...</div>)
    .with(null, () => <div>not logged in. redirecting...</div>)
    .otherwise(user => <Dash user={user} />);
};
