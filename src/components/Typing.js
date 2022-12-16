import React, { useState, useEffect } from "react";
import styles from "../routes/Home.module.css";

const useScroll = () => {
  const [state, setState] = useState({
    x: 0,
    y: 0,
  });

  const onScroll = () => {
    const valueX = Math.round(window.scrollX);
    const valueY = Math.round(window.scrollY);
    setState({ x: valueX, y: valueY });
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return state;
};

const Typing = ({ text, text2, speed, fontSize = "1em", color = "black" }) => {
  const [Text, setText] = useState("");
  const [Text2, setText2] = useState("");
  const { y } = useScroll();

  useEffect(() => {
    if (y >= 0 && y <= 400) {
      const interval = setInterval(() => {
        setText((Text) => {
          return text.slice(0, Text.length + 1);
        });
      }, speed);

      //첫번째 줄 다 쳤을때
      if (text.length === Text.length) {
        clearInterval(interval);
        // 첫번째 텍스트가 다 채워진 다음 두번째 텍스트 입력
        const interval2 = setInterval(() => {
          setText2((Text2) => {
            return text2.slice(0, Text2.length + 1);
          });
        }, speed);
        if (text2.length === Text2.length) {
          clearInterval(interval2);
        }
        return () => clearInterval(interval2);
      }

      //언마운트 / 한글자 나올때마다 setInterval 멈춤
      return () => {
        clearInterval(interval);
      };
    } else {
      setText("");
      setText2("");
    }
  }); // , [Text.length, Text2.length, speed, text, text2, y] 를 적은 이유는 뭘까? 없어도 실행 화면이 같음.

  return (
    <h2>
      {Text} <br />
      <span className={styles.fontRight2}>{Text2}</span>
    </h2>
  );
};

export default Typing;
