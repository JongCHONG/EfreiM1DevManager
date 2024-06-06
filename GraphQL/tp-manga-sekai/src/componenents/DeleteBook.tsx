import React from "react";
import { gql, useMutation } from "@apollo/client";
import { RiDeleteBin6Line } from "react-icons/ri";

const DELETE_BOOK = gql`
  mutation DeleteBook($deleteBookId: ID!) {
    deleteBook(id: $deleteBookId) {
      id
    }
  }
`;

interface DeleteBookProps {
  bookId: string;
  refetchBooks: () => void;
}

const DeleteBook: React.FC<DeleteBookProps> = ({ bookId, refetchBooks }) => {
  const [deleteBook, { loading, error }] = useMutation(DELETE_BOOK);

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error! {error.message}</p>;

  const handleDelete = async () => {
    await deleteBook({ variables: { deleteBookId: bookId } });
    refetchBooks();
    console.log("Book deleted");
  };

  return (
    <div>
      <RiDeleteBin6Line className="icon deleteIcon" onClick={() => handleDelete()} />
    </div>
  );
};

export default DeleteBook;
