import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Wrapper,
  Form,
  Title,
  Switcher,
  Error,
  Img,
} from "../components/auth-components";

export default function CreateAccount() {
  const navigate = useNavigate();
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      // create an account
      // set the name of the user.
      // redirect to the home page
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        displayName: name,
      });
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
    // console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>
        Join to <Img src="./public/twitter.svg" />
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
      <Switcher>
        Already have an account?
        <Link to="/login"> Log in &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
