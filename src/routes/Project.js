import React, { Component } from "react";
import "./Project.css";
import { ProgramItems, ProgramName } from "../components/ProgramItems";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { welfareItem } from "../components/welfareItem";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

const Program = () => {
  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </div>
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 864,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="program">
        {ProgramName.map((name, idx) => {
          return (
            <div key={idx} className="programList">
              <h2 className="programName">
                <span className="programNameIcon">{name.icon}</span>

                {name.type}
              </h2>

              <Slider {...settings} className="hi">
                {ProgramItems[idx].map((item, index) => {
                  return (
                    <div key={index} className="programItem">
                      <img
                        src={require(`../img/${item.img}`)}
                        width="260"
                        height="180"
                      />
                      <h3>{item.title}</h3>
                      <span className="programDate">{item.date}</span>
                      <div className="programHover"></div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Welfare = () => {
  return (
    <div className="welfareWrap">
      <div className="welfare">
        {welfareItem.map((item, index) => {
          return (
            <div key={index} className="welfareItem">
              <FontAwesomeIcon icon={faBookmark} className="welfareIcon" />
              <h1 className="welfareTitle">{item.title}</h1>
              <span className="welfareContent">{item.content}</span>
              <ul className="welfareDetail">
                <li className="welfareSub">지원대상: {item.subject}</li>
                <li className="welfareDept">신청방법: {item.dept}</li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Project = () => {
  const [index, setIndex] = React.useState("0");
  const onSelect = (event) => {
    setIndex(event.target.value);
  };
  return (
    <div>
      <div className="mainHeader">
        <h1>함께서기 프로젝트</h1>
        <select value={index} onChange={onSelect} className="program_select">
          <option value="0">함께 프로그램</option>
          <option value="1">함께 복지정책</option>
        </select>
      </div>
      {/* 인덱스에 따라 프로그램 : 복지정책 */}
      {index === "0" ? <Program /> : null}
      {index === "1" ? <Welfare /> : null}
    </div>
  );
};
export default Project;
