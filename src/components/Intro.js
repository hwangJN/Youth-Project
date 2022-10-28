import { useEffect, useRef, useState } from "react";
import style from "./Intro.module.css";
//import family from "../img/family1.jpg";
import job from "../img/job.jpg";
import art from "../img/art.jpg";
import mentor from "../img/mentor.jpg";
import Typing from "../components/Typing";

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
  }, [onScroll]);
  return state;
};

const useFadeIn = (duration = 1, delay = 0, direction = "left") => {
  const element = useRef();
  const { y } = useScroll();
  const [trList, setTrList] = useState([]);
  useEffect(() => {
    if (direction === "up") {
      setTrList(["translateY(0px)", "translate3d(0, 50%, 0)"]);
    } else if (direction === "left") {
      setTrList(["translateX(0px)", "translate3d(50%, 0, 0)"]);
    } else if (direction === "right") {
      setTrList(["translateX(0px)", "translate3d(-50%, 0, 0)"]);
    }
    if (y >= 440 && y < 1000) {
      const { current } = element;
      current.style.transition = `all ${duration}s ease-in-out ${delay}s`;
      current.style.transform = trList[0];
      current.style.opacity = 1;
    } else {
      const { current } = element;
      current.style.transition = `all 0s ease-in-out 0s`;
      current.style.transform = trList[1];
      current.style.opacity = 0;
    }
  }, [y]);
  return {
    ref: element,
    style: { transform: trList[1], opacity: 0 },
  };
};

function Intro() {
  const introList = [
    "새로운 형태의 가족",
    "정서적 지원과 멘토 역할",
    "댜양한 정보와 프로그램 제공",
  ];
  const fadeInProgram1 = useFadeIn(1, 0);
  const fadeInProgram2 = useFadeIn(1, 1);
  const fadeInProgram3 = useFadeIn(1, 2);

  return (
    <div className={style.intro}>
      <div
        className={style.introColumn1}
        style={{
          backgroundImage: `url(${require("../img/intro.jpg")})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={style.introSummary}>
          <h1>보호종료청년을 위한 함께서기</h1>

          <div className={style.subtitle2}>
            <span>「함께서기는 이렇게 시작했습니다」</span>
          </div>
          <div className={style.subtitle3}>
            <span>
              보호종료청년들은 경제적 어려움 뿐 아니라 <br />
              의지할 수 있는 사회적 안전망이 없어 자립과정에서 많은 어려움을
              겪습니다. <br />
              사회적으로 고립된 청년들이 의지할 수 있는 커뮤니티를 만들어
              <br /> 홀로 서지않고 더불어 사는 사회를 만들기 위해 <br /> 이
              프로젝트를 시작하게 되었습니다.
            </span>
          </div>
        </div>
      </div>

      <div className={style.IntroColumn2}>
        <div {...fadeInProgram1} className={style.program}>
          <img src={mentor} className={style.programImg} alt="mentor" />
          <h3>관련 프로그램 & 복지 정보 </h3>
          <p className={style.programContent}>
            취미 활동, 심리 안정, 직업 탐색, 전문 교육, 취업 연계 등 <br />
            맞춤형 프로그램를 제공합니다.
          </p>
        </div>
        <div {...fadeInProgram2} className={style.program}>
          <img
            src={require("../img/friend.jpg")}
            className={style.programImg}
            alt="job"
          />
          <h3>새로운 형태의 가족</h3>
          <p className={style.programContent}>
            혼자 살기 어려운 청년들이 모여 새로운 가족을 결성할 수 있도록
            <br /> 지역별로 자유롭게 가족 신청 폼을 작성할 수 있습니다.
          </p>
        </div>
        <div {...fadeInProgram3} className={style.program}>
          <img
            src={require("../img/전담어른.jpg")}
            className={style.programImg}
            alt="art"
          />
          <h3>정서적 지원</h3>
          <p className={style.programContent}>
            청년들이 언제든지 도움을 요청할 수 있는 어른들을 배치하여
            <br />
            정서적 지원과 멘토 역할을 제공합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Intro;
