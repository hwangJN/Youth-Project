import React, { useState } from "react";
import { authService } from "../fbase";
import styles from "./Navigation.module.css";
import btnStyle from "./NavBtn_sidebar.module.css";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

function NavBtn({ isLoggedIn, refreshUserObj, sidenav, setChange }) {
  const history = useHistory();
  const [loginState, setLoginState] = useState(0);
  useEffect(() => {
    // 로그인 되어있을 때 // 아닐 때
    if (isLoggedIn) {
      setLoginState(2);
    }
  }, [isLoggedIn]);

  //상단 메뉴인지 사이드바 메뉴인지(에 따라 메뉴 위치(style)결정)
  let style = styles;
  if (sidenav) {
    style = btnStyle;
  }
  //로그아웃 버튼 클릭 함수
  const onLogOutClick = async () => {
    await authService.signOut().then(() => refreshUserObj());
    setLoginState(0);
    //setChange(); //사이드바 사라짐
    //history.push("/");
  };

  const loginBtnValue = [
    {
      name: "로그인",
      path: "/login",
    },
    {
      name: "회원가입",
      path: "/signin",
    },
    {
      name: "로그아웃",
      path: "/",
    },
    {
      name: "프로필",
      path: "/profile",
    },
  ];

  return (
    <div className={style.login}>
      {/* loginState=0 --> 로그인 loginState=2 --> 로그아웃  */}
      <button
        className={style.button}
        onClick={() => {
          setChange(); //누르면 setSideVar = false
          //로그아웃 버튼일 때
          if (loginState) {
            onLogOutClick();
          }
          history.push(loginBtnValue[loginState].path);
        }}
      >
        {loginBtnValue[loginState].name}
      </button>

      {/* loginState=0 --> 회원가입 loginState=2 --> 프로필  */}
      <button
        className={style.button}
        onClick={() => {
          setChange();
          history.push(loginBtnValue[loginState + 1].path);
        }}
      >
        {loginBtnValue[loginState + 1].name}
      </button>

      {/* 이전 코드
          {isLoggedIn ? (
        <>
          <button className={style.button} onClick={onLogOutClick}>
            로그아웃
          </button>
          <button
            className={style.button}
            onClick={() => {
              setChange(); //사이드바 사라짐
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
              setChange(); //사이드바 사라짐
              history.push("/login");
            }}
          >
            로그인
          </button>
          <button
            className={style.button}
            onClick={() => {
              setChange(); //사이드바 사라짐
              history.push("/signin");
            }}
          >
            회원가입
          </button>
        </>
      )}
        */}
    </div>
  );
}
export default NavBtn;
