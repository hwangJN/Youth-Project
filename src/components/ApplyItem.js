import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { dbService } from "../fbase";
import styles from "../routes/Apply.module.css";

const ApplyItem = ({
  isLoggedIn,
  sGu,
  formComplete,
  alreadyApply,
  isAdult,
  userObj,
}) => {
  const history = useHistory();
  const [fmyarray, setFmyArray] = useState([]);

  const q1 = query(
    collection(dbService, "Family"),
    where("restOfFmy", ">", 0),
    where("seoulGu", "==", sGu)
  ); //보호종료
  const q2 = query(
    collection(dbService, "Family"),
    where("restOfFmy", "==", 0),
    where("complete", "==", false),
    where("needAdult", "==", true),
    where("seoulGu", "==", sGu)
  ); //전담어른

  useEffect(() => {
    //가족신청 or 전담어른 btn click 상태에 따라 가져올 쿼리
    let fmyQuery = q1;
    if (formComplete) {
      fmyQuery = q2;
    }
    onSnapshot(fmyQuery, (snapshot) => {
      const familyarray = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));
      setFmyArray(familyarray);
    });
  }, [formComplete, sGu]);

  //원하는 폼 클릭 시
  const onClick = (fmyarray) => {
    const goToDetail = () => {
      history.push({
        pathname: `/applycontent/${fmyarray.id}`,
      });
    };

    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
    } else if (alreadyApply) {
      if (fmyarray.applyerId !== userObj.uid) {
        alert("이미 신청한 폼이 존재합니다."); //본인이 작성한 폼은 볼 수 있음
      } else goToDetail();
    } else {
      if (formComplete) {
        if (!isAdult) {
          alert("전담 어른만 이용할 수 있습니다.");
        } else goToDetail();
      } else {
        if (isAdult) {
          alert("전담어른은 신청할 수 없습니다.");
        } else goToDetail();
      }
    }
  };

  return (
    <div>
      <div className={styles.formList}>
        {fmyarray.length === 0 ? (
          <div className={styles.emptyForm}>
            <h3>신청 폼이 없습니다</h3>
          </div>
        ) : null}

        {fmyarray.map((fmyarray, idx) => {
          return (
            <div
              className={styles.form}
              key={idx}
              onClick={() => {
                onClick(fmyarray);
              }}
            >
              <>
                <div>
                  <span className={styles.formRegion_Complete}>
                    {fmyarray.seoulGu}
                  </span>
                  <span className={styles.formRegion_Complete}>
                    {fmyarray.seoulDong}
                  </span>
                  <span className={styles.restFmy}>
                    남은 인원 : {fmyarray.restOfFmy}
                  </span>
                </div>
                <span className={styles.formTitle}>{fmyarray.formTitle}</span>
              </>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ApplyItem;
