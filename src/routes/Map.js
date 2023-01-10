import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Map.css";
import { seoulRegion } from "../components/OptionOfRegion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";

import ApplyWriteBtn from "../components/ApplyWriteBtn";

const Map = ({ isLoggedIn, userObj }) => {
  const [region, setRegion] = useState([]);

  useEffect(() => {
    const regionArray = seoulRegion.map((item) => ({
      ...item,
      id: item.id,
    }));
    setRegion(regionArray);
  }, []);

  return (
    <div className="container">
      <div>
        <div className="seoulmap">
          <FontAwesomeIcon icon={faMap} className="mapIcon" />
          <div className="text">
            <h3 className="title_h3">지역별 가족 신청 </h3>
            <span className="seoul">서울특별시</span>
          </div>

          {/*가족 신청 폼 작성 버튼*/}
          <ApplyWriteBtn
            className="applyBtn"
            isLoggedIn={isLoggedIn}
            userObj={userObj}
            sGu="강남구"
          />

          {/* 지역별 pathname id를 map의 key(0~nn)로 지정 */}
          {region.map((item, key) => {
            return (
              <Link to={`/apply/${key}`}>
                <button key={key} className={item.style}>
                  {item.name}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Map;
