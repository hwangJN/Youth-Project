import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { seoulRegion } from "../components/OptionOfRegion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../fbase";
import styles from "./ApplyWrite.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";

const ApplyWrite = ({ userObj }) => {
  const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
  const [state, setState] = useState({
    seoulGu: "강남구",
    seoulDong: "-----------",
    formTitle: "",
    formContent: "",
    needAdult: false,
    numofFmy: 2,
    restOfFmy: 1,
  });

  let applyList = [];
  let applyList_email = [];

  const [error, setError] = useState(false);
  const history = useHistory();

  let selectRegion;
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "title") {
      setState({
        ...state,
        formTitle: value,
      });
    } else if (name === "content") {
      setState({
        ...state,
        formContent: value,
      });
    }
  };
  const onSelect = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "seoul-gu") {
      setState({
        ...state,
        seoulGu: value,
        seoulDong: "-----------",
      });
    } else if (name === "seoul-dong") {
      setState({
        ...state,
        seoulDong: value,
      });
    } else if (name === "numOfFamily") {
      setState({
        ...state,
        numofFmy: value,
        restOfFmy: value - 1,
      });
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (state.seoulDong !== "-----------") {
      await updateDoc(userObjRef, { applyForm: userObj.uid });
      const userObjSnap = await getDoc(userObjRef);
      if (userObjSnap.exists()) {
        applyList[0] = userObjSnap.data().userObject.nickname;
        applyList_email[0] = userObj.email;
      }
      await setDoc(doc(dbService, "Family", `${userObj.uid}`), {
        ...state,
        applyerId: userObj.uid,
        createdAt: Date.now(),
        applyList,
        applyList_email,
        complete: false,
      }).then((data) => {
        alert("신청되었습니다");
        goToApplyMain();
      });
    } else {
      setError(true);
    }
  };

  const goToApplyMain = () => {
    history.push({ pathname: "/apply", state: { sGu: state.seoulGu } });
  };
  const onCheck = () => {
    setState({
      ...state,
      needAdult: !state.needAdult,
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        <FontAwesomeIcon className={styles.icon} icon={faPeopleRoof} />
        <img
          src={require(`../img/밑줄5.png`)}
          alt="under"
          className={styles.underLine}
        />
        <span className={styles.title}>가족 신청하기</span>
        <input
          className={styles.formTitle}
          value={state.formTitle}
          type="text"
          name="title"
          placeholder="신청 제목 "
          required
          onChange={onChange}
        />
        <textarea
          className={styles.formContent}
          value={state.formContent}
          type="text"
          name="content"
          placeholder="내용을 작성하세요"
          required
          onChange={onChange}
        />
        <div className={styles.option}>
          <div className={styles.region}>
            <label className={styles.label}>함께 살 지역</label>

            <select
              className={styles.select}
              value={state.seoulGu}
              name="seoul-gu"
              onChange={onSelect}
            >
              {seoulRegion.map((region, idx) => {
                return (
                  <option value={region.name} key={idx}>
                    {region.name}
                  </option>
                );
              })}
            </select>

            {seoulRegion.forEach((seoulRegion) => {
              if (seoulRegion.name === state.seoulGu) {
                selectRegion = seoulRegion.Dong;
              }
            })}
            <select
              className={styles.select}
              value={state.seoulDong}
              name="seoul-dong"
              onChange={onSelect}
            >
              {selectRegion.map((Dong, idx) => {
                return (
                  <option value={Dong.name} key={idx}>
                    {Dong.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.numOf}>
            <label className={styles.label}>인원수 (본인 포함)</label>
            <select
              className={styles.select2}
              value={state.numofFmy}
              name="numOfFamily"
              onChange={onSelect}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </div>
          <div className={styles.adult}>
            <label className={styles.label}>전담어른 필요 여부</label>
            <input
              type="checkbox"
              checked={state.needAdult}
              onChange={onCheck}
            />
          </div>
        </div>
        <input className={styles.applyBtn} type="submit" value="작성하기" />

        {error ? (
          <div className={styles.errorDiv}>
            <span>동을 정확하게 선택하십시오.</span>
          </div>
        ) : null}
      </form>
    </div>
  );
};
export default ApplyWrite;
