import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./Authform.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
//import { authService } from "../fbase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = ({ value, refreshUserObj }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, SetError] = useState("");
  const history = useHistory();
  const [state, setState] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const auth = getAuth();
      setState("Loading....");
      if (value === "Signin") {
        await createUserWithEmailAndPassword(auth, email, password).then(
          (data) => goToPage(value, data.user.uid)
        );
      } else if (value === "Login") {
        await signInWithEmailAndPassword(auth, email, password).then((data) => {
          goToPage(value, data.user.uid);
        });
      }
    } catch (error) {
      SetError(error.message);
      if (value === "Signin") {
        setState("이미 존재하는 회원이거나 존재하지 않는 메일입니다.");
      } else if (value === "Login") {
        setState("이메일 혹은 비밀번호가 일치하지 않습니다.");
      }
    }
    refreshUserObj();
  };

  const goToPage = (value, userId) => {
    if (value === "Login") {
      history.push({
        pathname: "/",
        state: { id: userId },
      });
    } else if (value === "Signin") {
      history.push({
        pathname: "/profile",
        state: { id: userId, email: email },
      });
    }
  };
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.loginSide}>
          <h1 className={styles.loginSideTitle}>
            <FontAwesomeIcon icon={faHouse} className={styles.homeIcon} />
            함께서기
          </h1>
          <span className={styles.loginSideSpan}>
            함께서기에서 함께 할 가족과 의지할 친구를 만들며 <br />
            서로의 울타리가 되어주세요.
          </span>
        </div>
        <form onSubmit={onSubmit} className={styles.form}>
          <h2 className={styles.logintitle}>
            {value === "Login" ? "로그인" : "회원가입"}
          </h2>
          <h4 className={styles.label}>이메일</h4>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={onChange}
            required
            className={styles.input}
          />
          <h4 className={styles.label}>비밀번호</h4>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
            className={styles.input}
          />
          <div className={styles.rowBtn}>
            <input
              type="submit"
              value={value === "Login" ? "로그인" : "회원가입"}
              className={styles.btn}
            />
          </div>
          <span className={styles.state}>{state}</span>
        </form>
      </div>
    </>
  );
};

export default AuthForm;
