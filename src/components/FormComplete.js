import { async } from "@firebase/util";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { dbService } from "../fbase";
import styles from "../routes/Apply.module.css";

const FormComplete = ({ formComplete, isLoggedIn, userObj }) => {
  const q = query(collection(dbService, "Family"), where("restOfFmy", "==", 0));
  const [fmyarray, setFmyArray] = useState([]);
  const [isAdult, setIsAdult] = useState(false);
  const history = useHistory();
  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const familyarray = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));
      setFmyArray(familyarray);
    });
    //전담어른인지 아닌지
    const GetDocUser = async () => {
      const docUserRef = doc(dbService, "userObj", `${userObj.uid}`);

      const docSnap = await getDoc(docUserRef).then((document) => {
        if (document.data().userObject.protect === "adult") {
          setIsAdult(true);
        }
      });
    };
    GetDocUser();
  }, []);
  console.log(isAdult);
  return (
    <div>
      <div className={styles.formList}>
        {fmyarray.length === 0 ? (
          <div className={styles.emptyForm}>
            <h3>신청 폼이 없습니다</h3>
          </div>
        ) : null}
        {fmyarray.map((fmyarray, idx) => {
          if (fmyarray.needAdult && !fmyarray.complete) {
            return (
              <div
                className={styles.form}
                key={idx}
                onClick={() => {
                  if (isLoggedIn && isAdult) {
                    history.push({
                      pathname: "/applycontent",
                      state: {
                        applyObject: fmyarray,
                        formComplete: formComplete,
                      },
                    });
                  } else {
                    alert("전담 어른만 이용할 수 있습니다.");
                  }
                }}
              >
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
              </div>
            );
          } else return null;
        })}
      </div>
    </div>
  );
};
export default FormComplete;
