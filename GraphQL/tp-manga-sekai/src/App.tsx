import { useState } from "react";

import { gql, useQuery } from "@apollo/client";
import "./App.css";

import AddBook from "./componenents/AddBook";
import ListBooks from "./componenents/ListBooks";
import SignUp from "./componenents/SignUp";
import Login from "./componenents/Login";
import { useUser } from "./contexts/UserContext";

const App = () => {
  const { user } = useUser();
  const [openSignUpModal, setOpenSignUpModal] = useState<boolean>(false);
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

  const GET_BOOKS = gql`
    query GetBooks {
      books {
        id
        author
        title
        ownerEmail
      }
    }
  `;

  const handleSignUp = () => {
    setOpenSignUpModal(true);
  };

  const handleLogin = () => {
    setOpenLoginModal(true);
  };

  const { loading, error, data, refetch } = useQuery(GET_BOOKS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className="appContent">
      {!user ? (
        <div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      ) : (
        "Welcome!"
      )}
      <ListBooks data={data} refetchBooks={refetch} />
      <AddBook refetchBooks={refetch} />
      <SignUp
        openSignUpModal={openSignUpModal}
        setOpenSignUpModal={setOpenSignUpModal}
      />
      <Login
        openLoginModal={openLoginModal}
        setOpenLoginModal={setOpenLoginModal}
      />
    </div>
  );
};

export default App;
