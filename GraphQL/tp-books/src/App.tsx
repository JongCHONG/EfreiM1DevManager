import { gql, useQuery } from "@apollo/client";
import AddBook from "./componenents/AddBook";
import DeleteBook from "./componenents/DeleteBook";

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

  console.log(data?.books);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <table style={{ width: "10%", border: "1px solid black" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {data?.books.map((book: any) => (
            <tr key={book.title}>
              <td style={{ width: "10%", border: "1px solid black" }}>
                {book.title}
              </td>
              <td style={{ width: "10%", border: "1px solid black" }}>
                {book.author}
              </td>
              <td style={{ width: "10%", border: "1px solid black" }}>
                <DeleteBook bookId={book.id} refetchBooks={refetch} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddBook refetchBooks={refetch} />
    </>
  );
};

export default App;
