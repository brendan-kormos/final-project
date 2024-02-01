import './SignIn.css';

import React, { FormEvent, useCallback, useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';

import {
  FloatingLabel,
  Form,
  Button,
  Container,
  FormGroup,
  InputGroup,
} from 'react-bootstrap';

import NavBar from '../Components/NavBar';
import { Input } from 'postcss';

function concat(prev: string, concat: string) {
  if (prev.length > 0) prev += `. ${concat}`;
  else prev += concat;
  return prev;
}

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [validated, setValidated] = useState(false);
  const [userErrMessage, setUserErrMessage] = useState('');
  const [passErrMessage, setPassErrMessage] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    // if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    // }
    setValidated(true);
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      console.log(formData)
      const userData = Object.fromEntries(formData.entries());
      console.log(userData)
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = await res.json();
      console.log('Registered', user);
      navigate('/sign-in');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (location.pathname !== '/sign-up') {
      console.log('location', location);
      navigate('/sign-up');
    }
  }, []);

  function onlyLettersAndNumbers(str) {
    return Boolean(str.match(/^[A-Za-z0-9]*$/));
    // return Boolean(str.match(/^[a-zA-Z][a-zA-Z0-9.,$;]*$/));
  }

  function getUserValidity() {
    console.log('username', username);

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
    console.log('passerr', str);
    setPassErrMessage(str);
  }

  // useEffect(()=>{
  //   handleUserErrMsg()
  // },[])

  useEffect(() => {
    handleUserErrMsg(username);
    handlePassErrMsg(password);
  }, [validated]);

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
                onChange={(event) => {
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
                  className={`${
                    getUserValidity()
                    // showUserErr()
                    //   ? 'is-valid'
                    //   : username.length > 0
                    //   ? 'is-invalid'
                    //   : ''
                  }`}
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
                  className={`${
                    getPassValidity()
                    // showPassErr()
                    //   ? 'is-valid'
                    //   : password.length > 0
                    //   ? 'is-invalid'
                    //   : ''
                  }`}
                />
                <Form.Control.Feedback tooltip type="invalid">
                  {passErrMessage}
                </Form.Control.Feedback>
              </FloatingLabel>
            </FormGroup>

            {/* <Form.Check className="my-1 mx-auto" label="Remember me"></Form.Check> */}
            <Button type="submit" disabled={isLoading} className="my-2 bg-dark mx-auto w-50">
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
