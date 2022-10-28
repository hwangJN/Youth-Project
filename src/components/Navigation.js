import React, { useState, useEffect } from "react";
import style from "./Navigation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";

import { authService } from "../fbase";
import { navItems } from "./NavItem";
//const navItem = require("./NavItem");

import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import NavBtn from "./NavBtn";

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

    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  const setChange = (value) => {
    setSidnav(value);
  };
  return (
    <div>
      <nav className={style.container}>
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

        {width >= 960 ? (
          <>
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
            <NavBtn
              isLoggedIn={isLoggedIn}
              refreshUserObj={refreshUserObj}
              sidenav={sidenav}
              setChange={setChange}
            />
          </>
        ) : (
          <div className={style.sidemenuicon}>
            {sidenav ? (
              <FontAwesomeIcon
                className="sidenav-btn__icon"
                onClick={() => setSidnav(!sidenav)}
                icon={faXmark}
                color="black"
                size="2x"
              />
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

        {width < 960 && sidenav && (
          <>
            <ul className={style.sideBar}>
              <NavBtn
                isLoggedIn={isLoggedIn}
                refreshUserObj={refreshUserObj}
                sidenav={sidenav}
                setChange={setChange}
              />
              {navItems.map((item, idx) => {
                return (
                  <li key={idx} className={style.sideBarli}>
                    <Link
                      to={item.path}
                      className={style.sideBarLink}
                      onClick={() => setSidnav(!sidenav)}
                    >
                      <span className={style.subIcon}>{item.icon}</span>

                      <span className={style.subBarText}>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navigation;
