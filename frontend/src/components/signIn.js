import React, { useState, useEffect } from "react";

import { Form, Button } from "react-bootstrap";

import { apiUrl } from "./utils";

export default function SingIn() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setValidated(true);

    setLoader(true);

    fetch(`${apiUrl()}/auth/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        first_name: firstName,
        last_name: lastName,
        user_from: "Rednord",
        password: password,
        re_password: password2,
      }),
    })
      .then((res) => res.text())
      .then((result) => setError(result))
      .catch((error) => console.log(error));
  };

  let signingButton = "Inregistrati-va";

  if (loader) {
    signingButton = "Incarcare...";
  }

  if (
    error.includes("id") &&
    error.includes("email") &&
    error.includes("first_name") &&
    error.includes("last_name") &&
    error.includes("user_from") &&
    error.includes("@") &&
    !error.includes("Enter a valid email address") &&
    !error.includes("custom user with this email already exists.")
  ) {
    window.location.href = "/verificatiemail";
  }

  return (
    <React.Fragment>
      <Form
        noValidate
        validated={validated}
        // style={{
        //     width: '70%',
        //     margin: '0 0 0 15%',
        // }}
        onSubmit={handleSubmit}
      >
        {error.includes(
          "custom user with this email address already exists."
        ) ? (
          <Form.Label
            style={{
              color: "red",
              backgroundColor: "yellow",
              padding: ".2rem .2rem .2rem .7rem",
              width: "100%",
              border: "1px solid",
              borderRadius: "4px",
            }}
          >
            Un cont cu un astfel de email exista deja
          </Form.Label>
        ) : (
          ""
        )}
        {error.includes("Enter a valid email address.") ? (
          <Form.Label
            style={{
              color: "red",
              backgroundColor: "yellow",
              padding: ".2rem .2rem .2rem .7rem",
              width: "100%",
              border: "1px solid",
              borderRadius: "4px",
            }}
          >
            Adresa email nu este valida
          </Form.Label>
        ) : (
          ""
        )}
        {error.includes("The password is too similar to the first name.") ? (
          <Form.Label
            style={{
              color: "red",
              backgroundColor: "yellow",
              padding: ".2rem .2rem .2rem .7rem",
              width: "100%",
              border: "1px solid",
              borderRadius: "4px",
            }}
          >
            Parola este prea asemanatoare cu prenumele
          </Form.Label>
        ) : (
          ""
        )}
        {error.includes("This password is too short.") ? (
          <Form.Label
            style={{
              color: "red",
              backgroundColor: "yellow",
              padding: ".2rem .2rem .2rem .7rem",
              width: "100%",
              border: "1px solid",
              borderRadius: "4px",
            }}
          >
            Parola este prea mica, trebuie sa contina cel putin 8 caractere
          </Form.Label>
        ) : (
          ""
        )}
        {error.includes("This password is too common.") ? (
          <Form.Label
            style={{
              color: "red",
              backgroundColor: "yellow",
              padding: ".2rem .2rem .2rem .7rem",
              width: "100%",
              border: "1px solid",
              borderRadius: "4px",
            }}
          >
            Parola este prea simpla
          </Form.Label>
        ) : (
          ""
        )}
        {error.includes("This password is entirely numeric.") ? (
          <Form.Label
            style={{
              color: "red",
              backgroundColor: "yellow",
              padding: ".2rem .2rem .2rem .7rem",
              width: "100%",
              border: "1px solid",
              borderRadius: "4px",
            }}
          >
            Parola este alcatuita doar din numere
          </Form.Label>
        ) : (
          ""
        )}
        {error.includes("The two password fields didn't match.") ? (
          <Form.Label
            style={{
              color: "red",
              backgroundColor: "yellow",
              padding: ".2rem .2rem .2rem .7rem",
              width: "100%",
              border: "1px solid",
              borderRadius: "4px",
            }}
          >
            Campurile "Password" si "Confirm Password" nu coincid
          </Form.Label>
        ) : (
          ""
        )}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder='Trebuie sa contina "@"'
            onChange={(e) => {
              setEmail(e.target.value);
              setLoader(false);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Introduceti un email valid
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Prenume</Form.Label>
          <Form.Control
            required
            placeholder="Introduceti prenumele"
            onChange={(e) => {
              setFirstName(e.target.value);
              setLoader(false);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Introduceti prenumele
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nume</Form.Label>
          <Form.Control
            required
            placeholder="Introduceti numele"
            onChange={(e) => {
              setLastName(e.target.value);
              setLoader(false);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Introduceti numele
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Parola"
            onChange={(e) => {
              setPassword(e.target.value);
              setLoader(false);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Introduceti parola
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Confirmare parola"
            onChange={(e) => {
              setPassword2(e.target.value);
              setLoader(false);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Introduceti confirmarea parolei
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Button className="button" type="submit">
            {signingButton}
          </Button>
        </Form.Group>
      </Form>
    </React.Fragment>
  );
}
