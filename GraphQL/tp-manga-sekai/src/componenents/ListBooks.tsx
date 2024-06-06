import { useState } from "react";
import "../App.css";

import { GrEdit } from "react-icons/gr";

import DeleteBook from "./DeleteBook";
import Modal from "./Modal";

const ListBooks = ({
  data,
  refetchBooks,
}: {
  data: any;
  refetchBooks: any;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editBookId, setEditBookId] = useState<any>(null);

  const handleEdit = (id: string) => {
    setOpenModal(true)
    setEditBookId(id)
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.books.map((book: any) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td className="action">
                <DeleteBook bookId={book.id} refetchBooks={refetchBooks} />
                <GrEdit
                  className="icon editIcon"
                  onClick={() => handleEdit(book.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal openModal={openModal} setOpenModal={setOpenModal} editBookId={editBookId}/>
    </>
  );
};

export default ListBooks;
