import React from "react";
import { authService } from "../fbase";
import styles from "./Navigation.module.css";
import btnStyle from "./NavBtn_sidebar.module.css";
import { useHistory } from "react-router-dom";

function NavBtn({ isLoggedIn, refreshUserObj, sidenav, setChange }) {
  const history = useHistory();

  let style = styles;
  if (sidenav) {
    style = btnStyle;
  }
  const onLogOutClick = async () => {
    await authService.signOut().then(() => refreshUserObj());
    setChange(false);
    history.push("/");
  };

  return (
    <div className={style.login}>
      {isLoggedIn ? (
        <>
          <button className={style.button} onClick={onLogOutClick}>
            로그아웃
          </button>
          <button
            className={style.button}
            onClick={() => {
              setChange(false);
              history.push("/profile");
            }}
          >
            프로필
          </button>
        </>
      ) : (
        <>
          <button
            className={style.button}
            onClick={() => {
              setChange(false);
              history.push("/login");
            }}
          >
            로그인
          </button>
          <button
            className={style.button}
            onClick={() => {
              setChange(false);
              history.push("/signin");
            }}
          >
            회원가입
          </button>
        </>
      )}
    </div>
  );
}
export default NavBtn;
