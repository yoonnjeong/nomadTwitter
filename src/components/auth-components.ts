import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`;
export const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
`;
export const Input = styled.input`
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
export const Title = styled.h1`
  display: flex;
  align-items: top;
  font-size: 42px;
`;
export const Img = styled.img`
  width: 48px;
  margin-left: 10px;
`;
export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;
