import './SignIn.css';

import React, { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  FloatingLabel,
  Form,
  Button,
  Container,
  FormGroup,
} from 'react-bootstrap';

import NavBar from '../Components/NavBar';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = await res.json();

      sessionStorage.setItem('token', token);
      console.log('Signed In', user, '; received token:', token);
      //successfully signed in

      //TODO: take you to dashboard
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
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
                  type="username"
                  placeholder="name@example.com"
                  className=""
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  className=""
                />
              </FloatingLabel>
            </FormGroup>
            {/* <Form.Check className="my-1 mx-auto" label="Remember me"></Form.Check> */}

            <Button disabled={isLoading} className="my-2 bg-dark mx-auto w-50">
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
