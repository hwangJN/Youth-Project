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
  const [seoulGu, setSeoulGu] = useState("강남구");
  const [seoulDong, setSeoulDong] = useState("-----------");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [needAdult, setNeedAdult] = useState(false);
  const [numofFmy, setNumofFmy] = useState(2);
  const [restOfFmy, setRestOfFmy] = useState(1);
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
      setFormTitle(value);
    } else if (name === "content") {
      setFormContent(value);
    }
  };
  const onSelect = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "seoul-gu") {
      setSeoulGu(value);
      setSeoulDong("-----------");
    } else if (name === "seoul-dong") {
      setSeoulDong(value);
    } else if (name === "numOfFamily") {
      setNumofFmy(value);
      setRestOfFmy(value - 1);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (seoulDong !== "-----------") {
      await updateDoc(userObjRef, { applyForm: userObj.uid });
      const userObjSnap = await getDoc(userObjRef);
      if (userObjSnap.exists()) {
        applyList[0] = userObjSnap.data().userObject.nickname;
        applyList_email[0] = userObj.email;
      }
      await setDoc(doc(dbService, "Family", `${userObj.uid}`), {
        applyerId: userObj.uid,
        createdAt: Date.now(),
        formTitle,
        formContent,
        seoulGu,
        seoulDong,
        needAdult,
        numofFmy,
        restOfFmy,
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

    //refreshUserObj();
  };

  const goToApplyMain = () => {
    history.push({ pathname: "/apply", state: { sGu: seoulGu } });
  };
  const onCheck = () => {
    setNeedAdult(!needAdult);
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
          value={formTitle}
          type="text"
          name="title"
          placeholder="신청 제목 "
          required
          onChange={onChange}
        />
        <textarea
          className={styles.formContent}
          value={formContent}
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
              value={seoulGu}
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
              if (seoulRegion.name === seoulGu) {
                selectRegion = seoulRegion.Dong;
              }
            })}
            <select
              className={styles.select}
              value={seoulDong}
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
              value={numofFmy}
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
            <input type="checkbox" checked={needAdult} onChange={onCheck} />
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
