import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import FormComplete from "../components/FormComplete";
import { dbService } from "../fbase";
import styles from "./Apply.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

const Apply = ({ isLoggedIn, userObj }) => {
  const history = useHistory();
  const [formComplete, setFormComplete] = useState(false); //폼 대기와 완료
  //const [seoulGu, setSeoulGu] = useState("강남구"); //정렬 옵션
  const [fmyarray, setFmyArray] = useState([]); //디스플레이 array
  const [alreadySubmit, setAlreadySubmit] = useState(false); //이미 폼 만든 사람인지
  const [alreadyApply, setAlreadyApply] = useState(false); //이미 신청한 사람인지
  const [toggleBtn, setToggleBtn] = useState(false);
  const fmyref = collection(dbService, "Family");
  //console.log(seoulGu);

  let sGu = "강남구";
  const location = useLocation();
  if (location.state) {
    sGu = location.state.sGu;
  }

  const q = query(
    fmyref,
    where("restOfFmy", ">", 0),
    where("seoulGu", "==", sGu)
  );

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const familyarray = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));
      setFmyArray(familyarray);
    });
    //이미 폼을 만든 사람인지
    const isCreated = async () => {
      const docRef = doc(dbService, "Family", `${userObj.uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAlreadySubmit(true);
      }
      const Ref = doc(dbService, "userObject", `${userObj.uid}`);
      const userSnap = await getDoc(Ref);
      if (userSnap.exists()) {
        if (userSnap.data().applyForm) {
          setAlreadyApply(true);
        }
      }
    };
    isCreated();
  }, []);

  const applyBtn = () => {
    if (isLoggedIn) {
      if (alreadySubmit || alreadyApply) {
        alert("이미 신청 되었습니다.");
      } else {
        history.push("/applywrite");
      }
    } else {
      alert("로그인 후 이용해 주세요.");
    }
  };
  /*
  const onSelect = (event) => {
    const {
      target: { value },
    } = event;
    setSeoulGu(value);
  };*/

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
              !toggleBtn ? styles.btnClick : null,
            ].join(" ")}
            onClick={() => {
              setFormComplete(false);
              setToggleBtn(false);
            }}
          >
            가족 신청
          </button>
          <button
            className={[
              styles.toggleBtn,
              toggleBtn ? styles.btnClick : null,
            ].join(" ")}
            onClick={() => {
              setFormComplete(true);
              setToggleBtn(true);
            }}
          >
            전담 어른 신청
          </button>
        </div>
        {/*     <span>서울특별시</span>
        <select value={seoulGu} onChange={onSelect}>
          {seoulRegion.map((region, idx) => {
            return (
              <option value={region.name} key={idx}>
                {region.name}
              </option>
            );
          })}
        </select> */}

        {!formComplete ? (
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
                    if (isLoggedIn) {
                      history.push({
                        pathname: "/applycontent",
                        state: {
                          applyObject: fmyarray,
                          formComplete: formComplete,
                        },
                      });
                    } else {
                      alert("로그인 후 이용해 주세요.");
                    }
                  }}
                >
                  <div>
                    <span className={styles.formRegion}>
                      {fmyarray.seoulGu}
                    </span>
                    <span className={styles.formRegion}>
                      {fmyarray.seoulDong}
                    </span>
                    <span className={styles.restFmy}>
                      남은 인원 : {fmyarray.restOfFmy}
                    </span>
                  </div>

                  <span className={styles.formTitle}>{fmyarray.formTitle}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <FormComplete
            formComplete={formComplete}
            isLoggedIn={isLoggedIn}
            userObj={userObj}
          />
        )}
      </div>
    </div>
  );
};
export default Apply;
