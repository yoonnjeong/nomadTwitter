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
  Input,
} from "../components/auth-components";
import GithubButton from "../components/gihub-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  // const [isLoading, setLoading] = useState(false);
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const [formState, setFormState] = useState({
    isLoading: false,
    name: "",
    email: "",
    password: "",
    error: "",
  });
  const handleChange = (key: string, value: boolean | string) => {
    setFormState({ ...formState, [key]: value });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      // setName(value);
      handleChange("name", value);
    } else if (name === "email") {
      // setEmail(value);
      handleChange("email", value);
    } else if (name === "password") {
      // setPassword(value);
      handleChange("password", value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // setError("");
    handleChange("error", "");
    e.preventDefault();
    // if (isLoading || name === "" || email === "" || password === "") return;
    if (
      formState.isLoading ||
      formState.name === "" ||
      formState.email === "" ||
      formState.password === ""
    )
      return;
    try {
      // create an account
      // set the name of the user.
      // redirect to the home page
      // setLoading(true);
      handleChange("isLoading", true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        // email,
        formState.email,
        // password
        formState.password
      );
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        // displayName: name,
        displayName: formState.name,
      });
      navigate("/");
    } catch (e) {
      //setError
      if (e instanceof FirebaseError) {
        // console.log(e.code, e.message);
        // setError(e.message);
        handleChange("error", e.message);
      }
    } finally {
      // setLoading(false);
      handleChange("isLoading", false);
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
          value={formState.name}
          placeholder="Name"
          type="text"
          required
          onChange={onChange}
        />
        <Input
          name="email"
          value={formState.email}
          placeholder="Email"
          type="email"
          required
          onChange={onChange}
        />
        <Input
          name="password"
          value={formState.password}
          placeholder="Password"
          type="password"
          required
          onChange={onChange}
        />
        <Input
          type="submit"
          // value={isLoading ? "Loading..." : "Create Account"}
          value={formState.isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {formState.error !== "" ? <Error>{formState.error}</Error> : null}
      <Switcher>
        Already have an account?
        <Link to="/login"> Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
