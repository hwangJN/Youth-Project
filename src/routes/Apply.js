import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Apply.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import ApplyItem from "../components/ApplyItem";
import { useEffect } from "react";
import { seoulRegion } from "../components/OptionOfRegion";
import ApplyWriteBtn from "../components/ApplyWriteBtn";

const Apply = ({ isLoggedIn, userObj }) => {
  const { id } = useParams(); //path="/board/:id"
  const [formComplete, setFormComplete] = useState(false); //가족신청 or 전담어른신청(toggle버튼)
  const [alreadySubmit, setAlreadySubmit] = useState(false); //이미 폼 만든 사람인지
  const [isAdult, setIsAdult] = useState(false);
  const [sGu, setSGu] = useState("");

  //페이지 id로 지역 가져오기
  useEffect(() => {
    function getGu() {
      seoulRegion.map((item, key) => {
        if (key === Number(id)) {
          setSGu(item.name);
        }
      });
    }
    getGu();
  }, []);

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
            <Link to="/map">
              <button className={styles.btn}>지역 선택</button>
            </Link>

            {/*가족 신청 폼 작성 버튼*/}
            <ApplyWriteBtn
              className={styles.btn}
              isLoggedIn={isLoggedIn}
              userObj={userObj}
              setAlreadySubmit2={setAlreadySubmit}
              setIsAdult2={setIsAdult}
              sGu={sGu}
            />
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
