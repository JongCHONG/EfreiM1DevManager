import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import "../App.css";

const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      email
      password
    }
  }
`;

const SignUp = ({
  openSignUpModal,
  setOpenSignUpModal,
}: {
  openSignUpModal: boolean;
  setOpenSignUpModal: (value: boolean) => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signUp, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signUp({ variables: { email, password } });
      setOpenSignUpModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <>
      {openSignUpModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </label>
              <button type="submit">Sign Up</button>
              <button type="button" onClick={() => setOpenSignUpModal(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
