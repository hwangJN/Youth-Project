import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./ProfileUpdate.module.css";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { dbService } from "../fbase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { MyFmyTable, ProfileForm } from "./ProfileComponent";
import SendEmail from "./SendEmail";

function ProfileUpdate({ userObj, refreshUserObj }) {
  const history = useHistory();

  //프로필
  const [Identity, setIdentity] = useState("protect");

  //나의 가족 확인
  const [seoulGu, setSeoulGu] = useState("");
  const [seoulDong, setSeoulDong] = useState("");
  const [numofFmy, setNumofFmy] = useState();
  const [applyer, setApplyer] = useState([]);
  const [applyerModi, setApplyerModi] = useState([]);
  const [applyerEmail, setApplyerEmail] = useState([]);
  const [complete, setComplete] = useState();
  const [needAdult, setNeedAdult] = useState(false);
  const [adultNickname, setAdultNickname] = useState("");
  const [adultEmail, setAdultEmail] = useState([]);

  //toggle
  const [myFmyBtn, setMyFmyBtn] = useState(false); //프로필인지 나의가족확인인지
  const [loading, setLoading] = useState(true);
  const [existForm, setExistForm] = useState(false); //폼이 존재하는지 아닌지
  const [isApplyer, setIsApplyer] = useState(false); //폼 작성자인지 아닌지(취소 여부)

  useEffect(() => {
    const getUser = async () => {
      const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
      const userObjSnap = await getDoc(userObjRef);
      let applyform = userObjSnap.data().applyForm;
      if (applyform === userObj.uid) {
        setIsApplyer(true);
      }

      const applyObjRef = doc(dbService, "Family", `${applyform}`); //Family obj를 찾음
      const docSnap = await getDoc(applyObjRef);

      if (docSnap.exists()) {
        if (docSnap.data().complete) setComplete(true);
        setLoading(false);
        setExistForm(true);
        setApplyer(docSnap.data().applyList);
        setApplyerEmail(docSnap.data().applyList_email);
        setApplyerModi(docSnap.data().applyList);
        setSeoulGu(docSnap.data().seoulGu);
        setSeoulDong(docSnap.data().seoulDong);
        setNeedAdult(docSnap.data().needAdult);
        setNumofFmy(docSnap.data().numofFmy);
        setAdultNickname(docSnap.data().audultNickname);
        setAdultEmail(docSnap.data().adultEmail);
      } else {
        setExistForm(false);
        setLoading(false);
      }
    };
    getUser();
  }, []);

  //내 신청내역 취소하기
  const cancelApply = () => {
    const getUser = async () => {
      const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
      const userObjSnap = await getDoc(userObjRef);
      let applyform = userObjSnap.data().applyForm;
      const applyObjRef = doc(dbService, "Family", `${applyform}`); //Family obj를 찾음
      const docSnap = await getDoc(applyObjRef);
      let nickname = userObjSnap.data().userObject.nickname;
      console.log(nickname);
      //let restOfFmy_num = docSnap.data().restOfFmy;
      if (docSnap.exists()) {
        //내 userObj 에서 신청 내역 삭제
        await updateDoc(userObjRef, {
          applyForm: deleteField(),
        });

        //폼 obj의 신청자 list에서 내 아이디 삭제후 남은 인원 update
        await updateDoc(applyObjRef, {
          restOfFmy: docSnap.data().restOfFmy + 1,
          applyList: applyerModi.filter((Element) => Element !== nickname),
          //applyList: deleteField(),
          // deleteField(),
        }).then(() => {
          history.push("/");
        });
      }
    };
    getUser();
  };

  return (
    <div className={styles.container}>
      {/*myFmyBtn : 프로필 or 나의 가족 신청 버튼 Click */}
      {!myFmyBtn ? (
        <ProfileForm
          userObj={userObj}
          refreshUserObj={refreshUserObj}
          setMyFmyBtn={setMyFmyBtn}
          setIdentity={setIdentity}
        />
      ) : (
        <div className={styles.fmyAndEmail}>
          <div className={styles.form}>
            {/* 신청 내역이 있을 경우 or 없을 경우 */}
            {/* 신청 내역이 있을 때 */}
            {!loading && existForm && (
              <>
                <div className={styles.titleDiv}>
                  <img
                    src={require(`../img/인덱스3.png`)}
                    className={styles.index}
                  />
                  <span className={styles.h1}> 나의 가족 신청</span>
                  <button
                    className={styles.gotoProfileBtn}
                    onClick={() => {
                      setMyFmyBtn((prev) => !prev);
                    }}
                  >
                    프로필
                  </button>
                </div>

                <form>
                  <MyFmyTable
                    seoulGu={seoulGu}
                    seoulDong={seoulDong}
                    numofFmy={numofFmy}
                    applyer={applyer}
                    applyerEmail={applyerEmail}
                    needAdult={needAdult}
                    adultNickname={adultNickname}
                    complete={complete}
                  />

                  {/* 폼 작성자가 아닌 경우 취소하기 */}
                  {!isApplyer ? (
                    <>
                      {!complete ? (
                        <button
                          className={styles.submitBtn}
                          onClick={cancelApply}
                        >
                          취소하기
                        </button>
                      ) : null}
                    </>
                  ) : null}
                </form>
              </>
            )}
            {/* 신청한 가족이 없을 때 */}
            {!loading && !existForm && (
              <div className={styles.noFmy}>
                <FontAwesomeIcon
                  className={styles.noFmyIcon}
                  icon={faCircleExclamation}
                />
                <h3 className={styles.noFmyText}>신청한 가족이 없습니다</h3>
                <button
                  className={styles.gotoProfileBtn_2}
                  onClick={() => {
                    setMyFmyBtn((prev) => !prev);
                  }}
                >
                  프로필
                </button>
              </div>
            )}
            {/* 로딩중 */}
            {loading && (
              <>
                <div className={styles.noFmy}>
                  <h1>Loading..</h1>
                </div>
              </>
            )}
          </div>

          {/* 메일 보내기 */}
          {complete && myFmyBtn && !(Identity === "adult") ? (
            <SendEmail
              needAdult={needAdult}
              adultEmail={adultEmail}
              applyerEmail={applyerEmail}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ProfileUpdate;
