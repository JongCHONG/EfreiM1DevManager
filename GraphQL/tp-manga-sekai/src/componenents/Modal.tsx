import { gql, useMutation, useQuery } from "@apollo/client";
import "../App.css";
import { useEffect, useState } from "react";

const Modal = ({
  openModal,
  setOpenModal,
  editBookId,
}: {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  editBookId: string;
}) => {
  const GET_BOOK_BY_ID = gql`
    query BookById($bookByIdId: ID!) {
      bookById(id: $bookByIdId) {
        id
        author
        title
      }
    }
  `;

  const MODIFY_BOOK = gql`
  mutation ModifyBook($editBookId: ID!, $title: String!, $author: String!) {
    modifyBook(id: $editBookId, title: $title, author: $author) {
      title
      author
    }
  }
`;

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [modifyBook] = useMutation(MODIFY_BOOK);

  const { loading, error, data, refetch } = useQuery(GET_BOOK_BY_ID, {
    variables: { bookByIdId: editBookId },
    skip: !editBookId,
  });

  useEffect(() => {
    if (data) {
      setTitle(data.bookById.title);
      setAuthor(data.bookById.author);
    }
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  }

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const handleUpdate = async () => {
    try {
      await modifyBook({ variables: { editBookId, title, author } });
      refetch();
      setOpenModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {openModal && (
        <div className="modal">
          <div className="modalContent">
            <input type="text" value={title} onChange={handleTitleChange}/>
            <input type="text" value={author} onChange={handleAuthorChange}/>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setOpenModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
