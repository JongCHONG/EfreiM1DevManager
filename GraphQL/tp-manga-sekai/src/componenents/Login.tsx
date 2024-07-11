import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import "../App.css";
import { useUser } from "../contexts/UserContext";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      password
    }
  }
`;

const Login = ({
  openLoginModal,
  setOpenLoginModal,
}: {
  openLoginModal: boolean;
  setOpenLoginModal: (value: boolean) => void;
}) => {
  const { setUser } = useUser();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      if (data?.login) {
        setUser(data.login);
        setOpenLoginModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <>
      {openLoginModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Email:
                <input type="email" value={email} onChange={handleEmailChange} />
              </label>
              <label>
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} />
              </label>
              <button type="submit">Login</button>
              <button type="button" onClick={() => setOpenLoginModal(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
