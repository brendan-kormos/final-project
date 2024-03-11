import './SignIn.css';

import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { type Auth, signIn } from '../lib';

import {
  FloatingLabel,
  Form,
  Button,
  Container,
  FormGroup,
} from 'react-bootstrap';

import NavBar from '../Components/NavBar';
type Props = {
  onSignIn: (auth: Auth) => void;
};
export default function SignIn({ onSignIn }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    async function handleSignIn(username: string, password: string) {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const auth = await signIn(username, password);
        if (auth.user && auth.token) {
          onSignIn(auth);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (event.currentTarget === null) throw new Error();
    const formData = new FormData(event.currentTarget);
    const entries = Object.fromEntries(formData.entries());
    const { username, password } = entries;

    try {
      await handleSignIn(username as string, password as string);
    } catch (err: any) {
      console.error(err.message);
      setErrMessage(err.message);
    }
  }
  return (
    <div className="h-100 d-flex flex-column ">
      <NavBar />
      <main
        style={{}}
        className="m-auto d-flex align-items-center flex-grow-1 w-100">
        <Container className="" style={{ maxWidth: 330 }}>
          <Form
            onSubmit={handleSubmit}
            className="w-100 d-flex flex-column"
            data-form-type="sign-in">
            <h1 className="my-2 h3 fw-normal text-center">Please Sign In</h1>
            <FormGroup className="form-group my-2">
              <FloatingLabel
                controlId="floatingInput"
                label="Username"
                className="">
                <Form.Control
                  name="username"
                  type="username"
                  placeholder="name@example.com"
                  className=""
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  className=""
                />
              </FloatingLabel>
              <div
                style={errMessage ? { display: 'block' } : {}}
                className="invalid-feedback">
                {errMessage}
              </div>
            </FormGroup>
            {/* <Form.Check className="my-1 mx-auto" label="Remember me"></Form.Check> */}

            <Button
              type="submit"
              disabled={isLoading}
              className="my-2 bg-dark mx-auto w-50">
              Sign In
            </Button>
            <div className="text-center" style={{ fontSize: 12 }}>
              <span>Already have an account? </span>
              <Link to="/sign-up">Sign Up</Link>
            </div>
          </Form>
        </Container>
      </main>
    </div>
  );
}
