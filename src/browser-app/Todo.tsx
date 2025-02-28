import { useParams } from "react-router-dom";
import { GetTodo } from "../common/actions";
import { useRequirements } from "./requirements";

export const Todo = () => {
  const { useQuery, useUser } = useRequirements();
  const { id } = useParams<{ id: string }>();
  const { data: todo } = useQuery(GetTodo)({
    id: id!,
    accessToken: user.access_token,
  })();

  return (
    <div>
      <p>Single Todo</p>
      {todo === undefined ? <p>loading todo...</p> : <p>{todo.title}</p>}
    </div>
  );
};
