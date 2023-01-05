import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import styles from "./Apply.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import ApplyItem from "../components/ApplyItem";
import { useEffect } from "react";

const Apply = ({ isLoggedIn, userObj }) => {
  const history = useHistory();

  const [formComplete, setFormComplete] = useState(false); //가족신청 or 전담어른신청(toggle버튼)
  const [alreadySubmit, setAlreadySubmit] = useState(false); //이미 폼 만든 사람인지
  const [isAdult, setIsAdult] = useState(false);
  const userRef = doc(dbService, "userObj", `${userObj.uid}`);

  let sGu = "강남구";
  const location = useLocation();
  if (location.state) sGu = location.state.sGu;

  useEffect(() => {
    //이미 신청한 사람인지
    const already = async () => {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        if (userSnap.data().applyForm) setAlreadySubmit(true);
        if (userSnap.data().userObject.protect === "adult") setIsAdult(true);
      }
    };
    already();
  }, []);
  const applyBtn = () => {
    if (isLoggedIn) {
      if (alreadySubmit) {
        alert("이미 신청 되었습니다.");
      } else if (isAdult) {
        alert("전담어른은 신청할 수 없습니다.");
      } else {
        history.push("/applywrite");
      }
    } else {
      alert("로그인 후 이용해 주세요.");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <div className={styles.title}>
          <span className={styles.titlename}>새로운 가족 찾기</span>
          <span className={styles.subtitle}>
            - 새로운 가족 모집 혹은 전담 어른을 신청해보세요.{" "}
          </span>
        </div>

        <div className={styles.guAndBtn}>
          <span className={styles.gu}>
            <FontAwesomeIcon
              icon={faMapPin}
              color="black"
              size="1x"
              className={styles.icon}
            />
            {sGu}
          </span>
          <div className={styles.btnDiv}>
            <button
              className={styles.btn}
              onClick={() => {
                history.push("./map");
              }}
            >
              지역 선택
            </button>
            <button className={styles.btn} onClick={applyBtn}>
              가족 신청
            </button>
          </div>
        </div>

        <div className={styles.topbtnDiv}>
          <button
            className={[
              styles.toggleBtn,
              !formComplete ? styles.btnClick : null,
            ].join(" ")}
            onClick={() => {
              setFormComplete(false);
            }}
          >
            가족 신청
          </button>
          <button
            className={[
              styles.toggleBtn,
              formComplete ? styles.btnClick : null,
            ].join(" ")}
            onClick={() => {
              setFormComplete(true);
            }}
          >
            전담 어른 신청
          </button>
        </div>
        {/* 신청 폼 목록(가족 신청+전담어른 신청) */}
        <ApplyItem
          isLoggedIn={isLoggedIn}
          sGu={sGu}
          formComplete={formComplete}
          alreadyApply={alreadySubmit}
          isAdult={isAdult}
          userObj={userObj}
        />
      </div>
    </div>
  );
};
export default Apply;
