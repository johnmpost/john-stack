import { useQuery as usePromiseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Dash } from "./Dash";
import { match } from "ts-pattern";
import { useRequirements } from "./requirements";

export const Root = () => {
  const { zitadel } = useRequirements();

  const { data: user } = usePromiseQuery({
    queryKey: ["user"],
    queryFn: () => zitadel.userManager.getUser(),
  });

  useEffect(() => {
    if (user === null || user?.expired) {
      zitadel.authorize();
    }
  }, [user, zitadel]);

  return match(user)
    .with(undefined, () => <div>loading app...</div>)
    .with(null, () => <div>not logged in. redirecting...</div>)
    .otherwise(user => <Dash user={user} />);
};
