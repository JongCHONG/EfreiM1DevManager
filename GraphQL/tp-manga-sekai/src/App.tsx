import { gql, useQuery } from "@apollo/client";
import "./App.css";

import AddBook from "./componenents/AddBook";
import ListBooks from "./componenents/ListBooks";

const App = () => {
  const GET_BOOKS = gql`
    query GetBooks {
      books {
        id
        author
        title
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_BOOKS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className="appContent">
      <ListBooks data={data} refetchBooks={refetch} />
      <AddBook refetchBooks={refetch} />
    </div>
  );
};

export default App;
