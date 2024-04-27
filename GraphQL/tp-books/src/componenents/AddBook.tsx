import React from 'react';
import { gql, useMutation } from "@apollo/client";

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!) {
    addBook(title: $title, author: $author) {
      title
      author
    }
  }
`;

interface AddBookProps {
  refetchBooks: () => void;
}

const AddBook: React.FC<AddBookProps> = ({ refetchBooks }) => {
  const [addBook, { loading, error }] = useMutation(ADD_BOOK);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addBook({ variables: { title: "Harry Potter", author: "J.K. Rowling" } });
    refetchBooks();
  };

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
