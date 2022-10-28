import AppRouter from "./Router";
import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import { useHistory } from "react-router-dom";
import styles from "./App.module.css";
function App() {
  //바로 코드를 실행시키면, 로그인 한 상태여도 firebase가 바로 로딩되지 않기 때문에
  //바로 로그인 된 상태를 받지 못함.
  const [init, setInit] = useState(false);
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const history = useHistory();

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        }); //setIsLoggedIn(true);
      } else {
        //setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUserObj = async () => {
    const user = await authService.currentUser;

    if (user) {
      console.log(user);
      setUserObj({
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
        updateProfile: (args) => user.updateProfile(args),
      });

      //history.push("/");
    } else {
      return;
    }

    console.log("refreshUserObj");
  };

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUserObj={refreshUserObj}
        />
      ) : (
        <div className={styles.container}>
          <span className={styles.span}>Loading....</span>
        </div>
      )}
    </>
  );
}

export default App;
