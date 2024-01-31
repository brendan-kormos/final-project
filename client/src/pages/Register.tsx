import React from 'react';
import { useParams } from 'react-router-dom';

import { FloatingLabel, Form, Button, Container } from 'react-bootstrap';

export default function Login() {
  return (
    <main style={{}} className="d-flex flex-column h-100 bg-body-tertiary">
      <Container
        className="m-auto justify-content-center align-content-center"
        style={{ maxWidth: 400, minWidth: 300 }}>
        <Form className="d-flex flex-column" data-form-type="login">
          <h1 className="text-center">Please Sign in</h1>
          <FloatingLabel
            controlId="floatingInput"
            label="Username"
            className="mb-2">
            <Form.Control
              type="email"
              placeholder="name@example.com"
              className=""
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control type="password" placeholder="Password" className="" />
          </FloatingLabel>
          {/* <Form.Check className="my-1 mx-auto" label="Remember me"></Form.Check> */}
          <Button type="submit" className="mt-2 bg-dark w-25 mx-auto">
            Register
          </Button>
        </Form>
      </Container>
    </main>
  );
}
