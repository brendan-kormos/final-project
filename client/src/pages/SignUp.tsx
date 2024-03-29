import './SignIn.css';

import React, { FormEvent, useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signUp } from '../lib';

import {
  FloatingLabel,
  Form,
  Button,
  Container,
  FormGroup,
} from 'react-bootstrap';

import NavBar from '../Components/NavBar';

function concat(prev: string, concat: string) {
  if (prev.length > 0) prev += `. ${concat}`;
  else prev += concat;
  return prev;
}

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [errMessage, setErrMessage] = useState('');
  const [userErrMessage, setUserErrMessage] = useState('');
  const [passErrMessage, setPassErrMessage] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    async function handleSignUp(username: string, password: string) {
      try {
        if (isLoading) return
        setIsLoading(true);
        await signUp(username, password);
        navigate('/sign-in');
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (event.currentTarget === null) throw new Error();
    const formData = new FormData(event.currentTarget);
    const entries = Object.fromEntries(formData.entries());
    const { username, password } = entries;

    try {
      await handleSignUp(username as string, password as string);
    } catch (err: any) {
      setErrMessage(err.message);
    }
  }

  useEffect(() => {
    if (location.pathname !== '/sign-up') {
      navigate('/sign-up');
    }
  }, []);

  function onlyLettersAndNumbers(str) {
    return Boolean(str.match(/^[A-Za-z0-9]*$/));
    // return Boolean(str.match(/^[a-zA-Z][a-zA-Z0-9.,$;]*$/));
  }

  function getUserValidity() {
    if (username.length === 0) return '';
    if (userErrMessage.length > 0) return 'is-invalid';
    if (userErrMessage.length === 0) return 'is-valid';
  }

  function handleUserErrMsg(value: string) {
    let str = ''; // current error message
    if (value.length < 3) str += 'Username must be at least 3 characters';
    if (value.length > 20) str += 'Username must be at most 20 characters';
    if (Number(value[0])) str = concat(str, 'Must start with a letter');
    if (!onlyLettersAndNumbers(value))
      str = concat(str, 'Must only contain letters and numbers');
    setUserErrMessage(str);
  }

  function getPassValidity() {
    if (password.length === 0) return '';
    if (passErrMessage.length > 0) return 'is-invalid';
    if (passErrMessage.length === 0) return 'is-valid';
  }

  function handlePassErrMsg(value: string) {
    let str = ''; // current error message
    if (value.length < 5) str += 'Password must be at least 5 characters';
    if (value.length > 20) str += 'Password must be at most 20 characters';

    // if (Number(username[0])) str = concat(str, 'Must start with a letter');
    // if (!onlyLettersAndNumbers(username))
    //   str = concat(str, 'Must only contain letters and numbers');
    setPassErrMessage(str);
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
            data-form-type="login">
            <h1 className="my-2 h3 fw-normal text-center">Create an Account</h1>

            <FormGroup className="form-group my-2">
              <FloatingLabel
                onChange={(event:React.ChangeEvent<HTMLInputElement>) => {
                  setUsername(event.target.value);
                  handleUserErrMsg(event.target.value);
                }}
                controlId="floatingInput"
                label="Username"
                className={`${''}`}>
                <Form.Control
                  required
                  name="username"
                  type="username"
                  placeholder="username"
                  className={`${getUserValidity()}`}
                />
                <Form.Control.Feedback tooltip type="invalid">
                  {userErrMessage}
                </Form.Control.Feedback>
                {/* <Form.Control.Feedback type="invalid" tooltip>
                  {errorMessage}
                </Form.Control.Feedback> */}
              </FloatingLabel>
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  onChange={(event) => {
                    setPassword(event.target.value);
                    handlePassErrMsg(event.target.value);
                  }}
                  required
                  name="password"
                  type="password"
                  placeholder="password"
                  className={`${getPassValidity()}`}
                />
                <Form.Control.Feedback tooltip type="invalid">
                  {passErrMessage}
                </Form.Control.Feedback>
              </FloatingLabel>
            </FormGroup>
            <div
              style={errMessage ? { display: 'block' } : {}}
              className="invalid-feedback">
              {errMessage}
            </div>
            {/* <Form.Check className="my-1 mx-auto" label="Remember me"></Form.Check> */}
            <Button
              type="submit"
              disabled={isLoading}
              className="my-2 bg-dark mx-auto w-50">
              Sign Up
            </Button>
            <div className="text-center" style={{ fontSize: 12 }}>
              <span>Already have an account? </span>
              <Link to="/sign-in">Sign In</Link>
            </div>
          </Form>
        </Container>
      </main>
    </div>
  );
}
