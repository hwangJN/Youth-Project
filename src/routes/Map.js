import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Map.css";
import { seoulRegion } from "../components/OptionOfRegion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin, faMap } from "@fortawesome/free-solid-svg-icons";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../fbase";

const Map = ({ isLoggedIn, userObj }) => {
  const [alreadySubmit, setAlreadySubmit] = useState(false); //이미 폼 만든 사람인지
  useEffect(() => {
    const isCreated = async () => {
      const docRef = doc(dbService, "Family", `${userObj.uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAlreadySubmit(true);
      }
    };
    isCreated();
  }, []);

  const applyBtn = () => {
    if (isLoggedIn) {
      if (alreadySubmit) {
        alert("이미 신청 되었습니다.");
      } else {
        history.push("/applywrite");
      }
    } else {
      alert("로그인 후 이용해 주세요.");
    }
  };
  const history = useHistory();
  return (
    <div className="container">
      <div>
        <div className="seoulmap">
          <FontAwesomeIcon icon={faMap} className="mapIcon" />
          <div className="text">
            <h3 className="title_h3">지역별 가족 신청 </h3>
            <span className="seoul">서울특별시</span>
          </div>
          <button className="applyBtn" onClick={applyBtn}>
            신청하기
          </button>
          {seoulRegion.map((gu, key) => {
            return (
              <button
                key={key}
                className={gu.style}
                onClick={() => {
                  history.push({
                    pathname: "/apply",
                    state: { sGu: gu.name },
                  });
                }}
              >
                {gu.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Map;
