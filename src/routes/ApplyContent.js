import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import styles from "./ApplyContent.module.css";

import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { dbService } from "../fbase";

const ApplyContent = ({ userObj }) => {
  //폼 상세 페이지
  const [mode, setMode] = useState(false); // 삭제 or 수정
  const history = useHistory();

  const location = useLocation();
  const formComplete = location.state.formComplete;
  const applyObject = location.state.applyObject;
  const restOfFmy = applyObject.restOfFmy;
  const creatorId = applyObject.applyerId;

  const [toggle, setToggle] = useState(false); // 신청했던 사람이면
  const [newApplyList, setApplyList] = useState([]); // 신청안했던 사람이면 리스트에 신청 유저 추가
  const [newApplyListEmail, setApplyListEmail] = useState([]);
  const applyObjRef = doc(dbService, "Family", `${creatorId}`);
  const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);

  const [formFull, setFormFull] = useState(false);
  const [needAdult, setNeedAdult] = useState(false);
  const [formId, setFormId] = useState("");
  const [seoulGu, setSeoulGu] = useState("");
  const [adultNickname, setAdultNickname] = useState("");
  const [adultEmail, setAdultEmail] = useState("");

  let nickName = "";
  const GetDoc = async () => {
    //신청 유저 list에 신규 유저 추가하기
    const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
    const userObjSnap = await getDoc(userObjRef);
    if (userObjSnap.exists()) {
      if (userObjSnap.data().userObject.protect === "adult") {
        setAdultNickname(userObjSnap.data().userObject.nickname);
        setAdultEmail(userObj.email);
      } else {
        nickName = userObjSnap.data().userObject.nickname;
      }
    }
    const docSnap = await getDoc(applyObjRef);
    if (docSnap.exists()) {
      setSeoulGu(docSnap.data().seoulGu);
      const collection_applyList = docSnap.data().applyList;
      collection_applyList.map((item) => {
        if (item === nickName) {
          setToggle(true);
        }
        return 0;
      });
      const collection_applyList_emails = docSnap.data().applyList_email;
      if (!toggle) {
        setApplyList([...collection_applyList, nickName]);
        setApplyListEmail([...collection_applyList_emails, userObj.email]);
      }
      if (docSnap.data().needAdult) setNeedAdult(true);
      if (docSnap.data().restOfFmy === 0) setFormFull(true);
      setFormId(docSnap.data().applyerId);
    }
  };

  useEffect(() => {
    //신청폼 작성자이면 삭제모드
    if (userObj.uid === applyObject.applyerId) {
      setMode(true);
    }
    GetDoc();
  }, []);

  //본인이 삭제할 때
  const DeleteDoc = async () => {
    if (newApplyList.length > 2) {
      alert("1명 이상 신청 폼으로 삭제할 수 없습니다.");
    } else {
      alert("삭제되었습니다");
      await deleteDoc(applyObjRef);
      await updateDoc(userObjRef, {
        applyForm: deleteField(),
      }).then((data) => history.push({ pathname: "/map" }));
    }
  };
  //대기 폼으로 옮기고 지움
  const MoveAndDeleteObj = async () => {
    const docSnap = await getDoc(applyObjRef);
    //대기 폼일때
    if (docSnap.data().restOfFmy === 0) {
      //전담어른이 필요하지 않으면 complete
      if (!needAdult) {
        await updateDoc(applyObjRef, { complete: true, adultId: userObj.uid });
      }
    } else return;
  };

  //타인이 신청하기
  const fomrApply = async () => {
    if (toggle) {
      alert("이미 신청했습니다.");
    } else {
      alert("신청되었습니다");
      await updateDoc(userObjRef, { applyForm: formId });
      await updateDoc(applyObjRef, {
        restOfFmy: Number(restOfFmy) - 1,
        applyList: newApplyList,
        applyList_email: newApplyListEmail,
      })
        .then((data) => {
          MoveAndDeleteObj();
        })
        .then((data) =>
          history.push({
            pathname: "/apply",
            state: { sGu: applyObject.seoulGu },
          })
        );
    }
  };

  const applyBtn = () => {
    //신청하기
    if (!mode) fomrApply();
    //삭제하기
    else DeleteDoc();
  };

  //전담어른이 신청할 때
  const applyAdult = async () => {
    alert("신청되었습니다");
    await updateDoc(userObjRef, { applyForm: formId });
    await updateDoc(applyObjRef, {
      complete: true,
      adultId: userObj.uid,
      audultNickname: adultNickname,
      adultEmail,
    }).then(() => {
      history.push({ pathname: "/apply", state: { sGu: seoulGu } });
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.detail}>
        <button
          className={styles.goToList}
          onClick={() => {
            history.push({
              pathname: "/apply",
              state: { sGu: applyObject.seoulGu },
            });
          }}
        >
          목록
        </button>

        <span className={styles.title}>
          {formComplete ? (
            <button className={styles.state2}>모집 완료</button>
          ) : (
            <button className={styles.state}>모집 중</button>
          )}
          {applyObject.formTitle}
        </span>
        <div className={styles.condition}>
          <span>
            지역 :{" "}
            <span className={styles.weight}>서울 {applyObject.seoulGu}</span>
          </span>
          <span className={styles.seoulDong}>
            <span className={styles.weight}>{applyObject.seoulDong}</span>
          </span>
        </div>
        <div className={styles.condition}>
          <span>
            전담어른 필요 여부 :{" "}
            <span className={styles.weight}>
              {applyObject.needAdult ? "O" : "X"}
            </span>
          </span>
        </div>
        <div className={styles.condition}>
          <span>
            모집 인원 :{" "}
            <span className={styles.weight}>{applyObject.numofFmy}명</span>
          </span>
        </div>
        <div className={styles.condition}>
          <span>
            남은 인원 :{" "}
            <span className={styles.weight}>{applyObject.restOfFmy}명</span>
          </span>
        </div>

        <div className={styles.content}>
          <span>{applyObject.formContent}</span>
        </div>
        {formFull ? (
          <button onClick={applyAdult} className={styles.rowBtn}>
            전담어른
            <br />
            신청하기
          </button>
        ) : (
          <button onClick={applyBtn} className={styles.rowBtn}>
            {mode ? "삭제하기" : "신청하기"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplyContent;
