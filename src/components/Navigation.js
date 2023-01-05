import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "./Navigation.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";

import { navItems } from "./NavItem"; //메뉴 아이템 리스트
import NavBtn from "./NavBtn"; //로그인 회원가입 프로필 버튼

const Navigation = ({ isLoggedIn, userObj, refreshUserObj }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [sidenav, setSidnav] = useState(false);
  useEffect(() => {
    const changeWidth = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth >= 960) {
        setSidnav(false);
      }
    };

    window.addEventListener("resize", changeWidth);
    //메모리 누수를 줄이기 위한 removeEvent
    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  return (
    <div>
      <nav className={style.container}>
        {/*로고:고정*/}
        <div className={style.logo}>
          <Link to="/" className={style.logolink}>
            {/* <span className={style.titlename}>함께 서기</span> */}
            <img src={require("../img/로고12.png")} />
            <div className={style.subtitle}>
              <h5>
                보호종료청년을 위한 <br /> 커뮤니티 서비스
              </h5>
            </div>{" "}
          </Link>
        </div>

        {/*윈도우 창 클때 // 작을때*/}
        {width >= 960 ? (
          <>
            {/*상단 메뉴 리스트*/}
            <ul className={style.manuBar}>
              {navItems.map((item, idx) => {
                return (
                  <li key={idx} className={style.topLi}>
                    <Link to={item.path} className={style.manuBarLink}>
                      {/* {item.icon}*/}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/*로그인 회원가입(프로필)btn*/}
            <NavBtn
              isLoggedIn={isLoggedIn}
              refreshUserObj={refreshUserObj}
              sidenav={sidenav}
              //클릭이벤트
              //창 크기 작을 때(여기선 활용x) 사이드 메뉴에 있는 버튼을 클릭하고 나면 사이드 바 사라지기
              setChange={() => setSidnav(false)}
            />
          </>
        ) : (
          <div className={style.sidemenuicon}>
            {/*윈도우 창 작을 때 // 버튼 누른 상태에서 메뉴 리스트 DP // 버튼 안눌렀을 때 아이콘만*/}
            {sidenav ? (
              <>
                {/*버튼 누른 상태 아이콘(X모양)*/}
                <FontAwesomeIcon
                  className="sidenav-btn__icon"
                  onClick={() => setSidnav(false)}
                  icon={faXmark}
                  color="black"
                  size="2x"
                />
                <ul className={style.sideBar}>
                  {/*로그인 회원가입(프로필) 버튼*/}
                  <NavBtn
                    isLoggedIn={isLoggedIn}
                    refreshUserObj={refreshUserObj}
                    sidenav={sidenav}
                    //클릭이벤트
                    //창 크기 작을 때 사이드 메뉴에 있는 버튼을 클릭하고 나면 사이드 바 사라지기
                    setChange={() => setSidnav(false)}
                  />
                  {/*메뉴 리스트*/}
                  {navItems.map((item, idx) => {
                    return (
                      <li key={idx} className={style.sideBarli}>
                        <Link
                          to={item.path}
                          className={style.sideBarLink}
                          onClick={() => setSidnav(false)}
                        >
                          <span className={style.subIcon}>{item.icon}</span>
                          <span className={style.subBarText}>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <FontAwesomeIcon
                className="sidenav-btn__icon"
                onClick={() => setSidnav(!sidenav)}
                icon={faBars}
                color="black"
                size="2x"
              />
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navigation;
