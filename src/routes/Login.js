import React from "react";
import AuthForm from "../components/Authform";

function Login({ userObj, refreshUserObj }) {
  return (
    <div>
      <AuthForm
        value="Login"
        refreshUserObj={refreshUserObj}
        userObj={userObj}
      />
    </div>
  );
}

export default Login;
