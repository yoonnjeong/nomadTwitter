import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Wrapper,
  Form,
  Title,
  Switcher,
  Error,
  Img,
  Input,
} from "../components/auth-components";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  console.log(FirebaseError);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");

    e.preventDefault();
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      //setError
      if (e instanceof FirebaseError) {
        // console.log(e.code, e.message);
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>
        Login into <Img src="./public/twitter.svg" />
      </Title>
      <Form onSubmit={onSubmit}>
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
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
