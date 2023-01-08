import { useHistory } from "react-router";
import styles from "../routes/ApplyContent.module.css";

import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { dbService } from "../fbase";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { seoulRegion } from "../components/OptionOfRegion";
const ApplyContentDetail = ({ userObj, applyObject }) => {
  const history = useHistory();
  //const location = useLocation();
  //const applyObject = location.state.applyObject;

  const applyObjRef = doc(dbService, "Family", `${applyObject.applyerId}`); // 업데이트 시 필요
  const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
  const [formFull, setFormFull] = useState(false); //전담어른 신청 내용 페이지 or 가족신청 내용 페이지

  let email = userObj.email;
  let nickName = "";
  const formId = applyObject.applyerId; // 신청 후 본인 userObj에 신청 폼 id 기록

  const [mode, setMode] = useState(false); // 삭제 or 신청

  //자신 이름 가져옴 + 가족신청or전담어른신청 여부 판단
  const GetDoc = async () => {
    const userObjSnap = await getDoc(userObjRef);
    if (userObjSnap.exists()) {
      nickName = userObjSnap.data().userObject.nickname;
    }
    if (applyObject.restOfFmy === 0) setFormFull(true);
  };

  useEffect(() => {
    //신청폼 작성자이면 삭제모드 /// 아니면 신청모드
    if (userObj.uid === applyObject.applyerId) {
      setMode(true);
    }
    GetDoc();
  }, []);

  //작성자가 본인 폼 삭제
  const DeleteDoc = async () => {
    if (applyObject.applyList.length > 2) {
      alert("1명 이상 신청 폼으로 삭제할 수 없습니다.");
    } else {
      alert("삭제되었습니다");
      await deleteDoc(doc(dbService, "Family", `${applyObject.applyerId}`));
      await updateDoc(userObjRef, {
        applyForm: deleteField(),
      }).then((data) => history.push({ pathname: "/map" }));
    }
  };

  //인원 다 차고 전담어른 필요하지 않을때 가족신청 div에서 사라짐(결성완료)
  const MoveAndDeleteObj = async () => {
    const docSnap = await getDoc(applyObjRef);
    //전담어른이 필요하지 않으면 complete
    if (docSnap.data().restOfFmy === 0 && !applyObject.needAdult) {
      await updateDoc(applyObjRef, { complete: true });
    }
  };

  const applyBtn = () => {
    //신청하기
    if (!mode) formApply();
    //삭제하기
    else DeleteDoc();
  };

  //타인이 신청하기
  const formApply = async () => {
    alert("신청되었습니다");
    await updateDoc(userObjRef, { applyForm: formId });
    await updateDoc(doc(dbService, "Family", `${applyObject.applyerId}`), {
      restOfFmy: Number(applyObject.restOfFmy) - 1,
      applyList: [nickName, ...applyObject.applyList],
      applyList_email: [email, ...applyObject.applyList_email],
    })
      .then((data) => {
        MoveAndDeleteObj();
      })
      .then((data) =>
        history.push({
          pathname: `/apply/${key}`,
        })
      );
  };

  //전담어른이 신청할 때
  const applyAdult = async () => {
    alert("신청되었습니다");
    await updateDoc(userObjRef, { applyForm: formId });
    await updateDoc(applyObjRef, {
      complete: true,
      adultId: userObj.uid,
      audultNickname: nickName,
      adultEmail: email,
    }).then(() => {
      history.push({ pathname: `/apply/${key}` });
    });
  };

  const [key, setKey] = useState(0);
  useEffect(() => {
    seoulRegion.map((item, key) => {
      if (item.name === applyObject.seoulGu) {
        setKey(key);
      }
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.detail}>
        <Link to={`/apply/${key}`}>
          <button className={styles.goToList}>목록</button>
        </Link>

        <span className={styles.title}>
          {formFull ? (
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

        {/* 하단 신청 버튼 */}
        <div className={styles.rowBtnDiv}>
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
    </div>
  );
};

export default ApplyContentDetail;
