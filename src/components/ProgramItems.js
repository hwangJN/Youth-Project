import {
  faBook,
  faBookmark,
  faCrown,
  faHeart,
  faMugHot,
  faMugSaucer,
  faShapes,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ProgramName = [
  {
    type: " 심리 안정 프로그램",
    icon: <FontAwesomeIcon icon={faBook} />,
  },
  { type: " 취미 활동", icon: <FontAwesomeIcon icon={faBookmark} /> },
  {
    type: " 취업/경제 분야",
    icon: <FontAwesomeIcon icon={faWallet} />,
  },
];

export const ProgramItems = [
  [
    {
      title: "미술 심리",
      img: "art.jpg",
      date: "2022.11.18~2022.12.02(매주 금 14:00~16:00)",
    },
    {
      title: "스트레스 대처법 특강",
      img: "stress.jpg",
      date: "2022.11.16(수) 15:00~17:00",
    },
    {
      title: "함께서기의 자아찾기",
      img: "ego.jpg",
      date: "2022.11.15(화)~2022.11.16(수)",
    },
    {
      title: "찾아가는 상담실",
      img: "counsel.jpg",
      date: "2022.11.07(월)~2022.11.11(금)",
    },
  ],
  [
    {
      title: "베이킹 클래스",
      img: "baking.jpg",
      date: "2022.11.16~2022.12.07(매주 수 16:00~18:00)",
    },
    {
      title: "건강한 한끼 레시피",
      img: "meal.jpg",
      date: "2022.11.14(월)~2022.11.18(금)(14:00~16:00)",
    },
    {
      title: "산책하러 갈래?",
      img: "walk.jpg",
      date: "2022.11.05~2022.11.26(매주 토 17:00~18:00)",
    },
    {
      title: "기초부터 기타레슨",
      img: "guitar.jpg",
      date: "2022.11.04~2022.11.25(매주 금 15:00~17:00)",
    },
  ],
  [
    {
      title: "스터디모임",
      img: "study.jpg",
      date: "매주 월,수,금 09:00~12:00",
    },
    {
      title: "미취업 청년의 일자리 매칭",
      img: "job.jpg",
      date: "2022.11.14(월)~2022.12.02(금)(14:00~17:00)",
    },
    {
      title: "제테크 공부",
      img: "stock.jpg",
      date: "2022.11.08~2022.11.29(매주 화 16:00~18:00)",
    },
    {
      title: "이력서/자소서 특강",
      img: "mentor.jpg",
      date: "2022.11.03(목) 14:00~16:00",
    },
  ],
];
