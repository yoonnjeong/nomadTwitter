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
import GithubButton from "../components/gihub-btn";

export default function Login() {
  const navigate = useNavigate();
  // const [isLoading, setLoading] = useState(false);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const [formState, setFormState] = useState({
    isLoading: false,
    email: "",
    password: "",
    error: "",
  });
  const handleInputChange = (key: string, value: boolean | string) => {
    setFormState({ ...formState, [key]: value });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      // setEmail(value);
      handleInputChange("email", value);
    } else if (name === "password") {
      // setPassword(value);
      handleInputChange("password", value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // setError("");
    handleInputChange("error", "");

    e.preventDefault();
    // if (isLoading || email === "" || password === "") return;
    if (
      formState.isLoading ||
      formState.email === "" ||
      formState.password === ""
    )
      return;
    try {
      // setLoading(true);
      handleInputChange("isLoading", true);
      // await signInWithEmailAndPassword(auth, email, password);
      await signInWithEmailAndPassword(
        auth,
        formState.email,
        formState.password
      );
      navigate("/");
    } catch (e) {
      //setError
      if (e instanceof FirebaseError) {
        // console.log(e.code, e.message);
        // setError(e.message);
        handleInputChange("error", e.message);
      }
    } finally {
      // setLoading(false);
      handleInputChange("isLoading", false);
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
          // value={email}
          value={formState.email}
          placeholder="Email"
          type="email"
          required
          onChange={onChange}
        />
        <Input
          name="password"
          // value={password}
          value={formState.password}
          placeholder="Password"
          type="password"
          required
          onChange={onChange}
        />
        <Input
          type="submit"
          // value={isLoading ? "Loading..." : "Log in"}
          value={formState.isLoading ? "Loading..." : "Log in"}
        />
      </Form>
      {/* {error !== "" ? <Error>{error}</Error> : null} */}
      {formState.error !== "" ? <Error>{formState.error}</Error> : null}
      <Switcher>
        Don't have an account?
        <Link to="/create-account">Create one &rarr;</Link>
        <GithubButton />
      </Switcher>
    </Wrapper>
  );
}
