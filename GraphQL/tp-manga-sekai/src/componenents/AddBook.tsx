import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import "../App.css";

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
  const [newBook, setNewBook] = useState<string>("");
  const [newAuthor, setNewAuthor] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addBook({ variables: { title: newBook, author: newAuthor } });
    refetchBooks();
  };

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBook(e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAuthor(e.target.value);
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" onChange={handleTitleChange} />
        <input type="text" placeholder="Author" onChange={handleAuthorChange} />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
