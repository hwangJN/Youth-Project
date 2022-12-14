import React from "react";
import { useEffect } from "react";
import styles from "./ProfileUpdate.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../fbase";
import { useHistory } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function MyFmyTable({
  seoulGu,
  seoulDong,
  numofFmy,
  applyer,
  applyerEmail,
  needAdult,
  adultNickname,
  complete,
}) {
  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <th>지역</th>
          <td>
            <span className={styles.td}>
              서울특별시 {seoulGu} {seoulDong}
            </span>
          </td>
        </tr>
        <tr>
          <th>인원수</th>
          <td>
            <span className={styles.td}>{numofFmy}명</span>
          </td>
        </tr>
        <tr>
          <th>현재 가족</th>
          <td>
            <ul className={styles.ul}>
              {applyer.map((nickName, idx) => {
                return (
                  <li className={styles.li} key={idx}>
                    {nickName}
                  </li>
                );
              })}
            </ul>
          </td>
        </tr>
        <tr>
          <th>가족 이메일</th>
          <td>
            <ul className={styles.ul_mail}>
              {applyerEmail.map((mail, idx) => {
                return (
                  <li className={styles.li_mail} key={idx}>
                    {mail}
                  </li>
                );
              })}
            </ul>
          </td>
        </tr>

        <tr>
          <th>전담어른 여부</th>
          <td>
            <span className={styles.td}>
              {needAdult ? (
                <>
                  <FontAwesomeIcon className={styles.OorX} icon={faCircle} />
                  <span className={styles.adultName}>
                    <span>{adultNickname}</span>
                  </span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon className={styles.OorX} icon={faX} />
                </>
              )}
            </span>
          </td>
        </tr>
        <tr>
          <th>가족 결성 여부</th>
          <td>
            <span className={styles.td}>
              {complete ? (
                <>
                  <FontAwesomeIcon className={styles.OorX} icon={faCircle} />
                </>
              ) : (
                <>
                  <FontAwesomeIcon className={styles.OorX} icon={faX} />
                </>
              )}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function ProfileForm({ userObj, refreshUserObj, setMyFmyBtn, setIdentity }) {
  const history = useHistory();
  //프로필
  const [profileState, setProfileState] = useState({
    newDisplayName: "",
    age: "",
    sex: "man",
    protect: "protect",
  });
  let collection = "";
  const [applyForm, setApplyForm] = useState();
  useEffect(() => {
    const getUser = async () => {
      const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
      const userObjSnap = await getDoc(userObjRef);

      if (userObjSnap.exists()) {
        collection = userObjSnap.data().userObject;
        setProfileState({
          newDisplayName: collection.nickname,
          age: collection.age,
          sex: collection.sex,
          protect: collection.protect,
        });
      }
      if (userObjSnap.data().applyForm !== undefined) {
        setApplyForm(userObjSnap.data().applyForm);
      }
    };

    getUser();
  }, []);
  const onSelect = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "sex") {
      setProfileState({
        ...profileState,
        sex: value,
      });
    } else if (name === "protect") {
      setProfileState({
        ...profileState,
        protect: value,
      });
    }
  };
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "Name") {
      setProfileState({
        ...profileState,
        newDisplayName: value,
      });
    } else if (name === "Age") {
      setProfileState({
        ...profileState,
        age: value,
      });
    }
  };
  const goToProfileUpdateComplete = async () => {
    if (applyForm) {
      await updateDoc(doc(dbService, "userObj", `${userObj.uid}`), {
        applyForm,
      });
    }

    alert("수정되었습니다.");
    history.push("/");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const userObject = {
      userId: userObj.uid,
      createdAt: Date.now(),
      nickname: profileState.newDisplayName,
      age: profileState.age,
      sex: profileState.sex,
      protect: profileState.protect,
    };

    await setDoc(doc(dbService, "userObj", `${userObj.uid}`), {
      userObject,
    }).then((data) => {
      goToProfileUpdateComplete();
    });
    refreshUserObj();
  };
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.titleDiv}>
        <FontAwesomeIcon className={styles.icon} icon={faUser} />
        <span className={styles.h1}>프로필</span>
        <button
          className={styles.myApplyBtn}
          onClick={() => {
            setMyFmyBtn((prev) => !prev);
          }}
        >
          나의 가족
        </button>
      </div>
      <span className={styles.span}>
        - 모든 항목 필수 기입해 주시기 바랍니다.
      </span>

      <table className={styles.table}>
        <tbody>
          <tr>
            <th>이메일</th>
            <td>
              <input
                className={styles.input}
                type="text"
                name="email"
                disabled
                value={userObj.email}
              />
            </td>
          </tr>
          <tr>
            <th>이름</th>
            <td>
              <input
                className={styles.input}
                name="Name"
                onChange={onChange}
                type="text"
                placeholder="이름"
                required
                value={profileState.newDisplayName}
              />
            </td>
          </tr>
          <tr>
            <th>나이</th>
            <td>
              <input
                className={styles.input}
                name="Age"
                onChange={onChange}
                type="text"
                placeholder="O세"
                value={profileState.age}
                required
              />
            </td>
          </tr>
          <tr>
            <th>성별</th>
            <td>
              <select
                value={profileState.sex}
                name="sex"
                onChange={onSelect}
                className={styles.select_sex}
              >
                <option value="man">남</option>
                <option value="woman">여</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>신분</th>
            <td>
              <select
                value={profileState.protect}
                name="protect"
                onChange={onSelect}
                className={styles.select}
              >
                <option value="protected" className={styles.option}>
                  보호종료청년
                </option>
                <option value="adult" className={styles.option}>
                  전담어른
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <input type="submit" value="수정하기" className={styles.submitBtn} />
    </form>
  );
}

export { MyFmyTable, ProfileForm };
