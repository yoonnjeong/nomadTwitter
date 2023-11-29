import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`;
const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;
const Title = styled.h1`
  display: flex;
  align-items: top;
  font-size: 42px;
`;
const Img = styled.img`
  width: 48px;
`;
const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export default function CreateAccount() {
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // create an account
      // set the name of the user.
      // redirect to the home page
    } catch (e) {
      //setError
    } finally {
      setLoading(false);
    }
    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>
        Log into <Img src="./public/twitter.svg" />
      </Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
          onChange={onChange}
        />
        <Input
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
          onChange={onChange}
        />
        <Input
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
          onChange={onChange}
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}
