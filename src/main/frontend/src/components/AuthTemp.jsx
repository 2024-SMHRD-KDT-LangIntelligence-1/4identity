import styled from "styled-components";

const AuthTempBlock = styled.div``;

const AuthTemp = ({ children }) => {
  return <AuthTempBlock>{children}</AuthTempBlock>;
};

export default AuthTemp;
