import React from "react";
import AuthForm from "../components/Authform";

function Signin({ userObj, isLoggedIn, refreshUserObj }) {
  return (
    <div>
      <AuthForm
        value="Signin"
        isLoggedIn={isLoggedIn}
        refreshUserObj={refreshUserObj}
        userObj={userObj}
      />
    </div>
  );
}

export default Signin;
