import './Login.css';

import React from 'react';
import { useParams } from 'react-router-dom';

import {
  FloatingLabel,
  Form,
  Button,
  Container,
  FormGroup,
} from 'react-bootstrap';

import NavBar from '../Components/NavBar';

export default function Login() {
  return (
    <div className="h-100 d-flex flex-column ">
      <NavBar />
      <main
        style={{}}
        className="m-auto d-flex align-items-center flex-grow-1 w-100">
        <Container className="" style={{ maxWidth: 330 }}>
          <Form className="w-100 d-flex flex-column" data-form-type="login">
            <h1 className="my-2 h3 fw-normal text-center">Please Log in</h1>
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
            <Button type="submit" className="my-2 bg-dark mx-auto w-50">
              Log in
            </Button>
            <div className="text-center" style={{ fontSize: 12 }}>
              <span>Don't have an account? </span>
              <a href="/register">Register</a>
            </div>
          </Form>
        </Container>
      </main>
    </div>
  );
}
