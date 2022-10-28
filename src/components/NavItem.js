import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faBarsProgress,
  faUserGroup,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

export const navItems = [
  {
    title: "함께소개",
    path: "/intro",
    icon: <FontAwesomeIcon icon={faHandHoldingHeart} />,
  },
  {
    title: " 프로그램",
    path: "/program",
    icon: <FontAwesomeIcon icon={faBarsProgress} />,
  },
  {
    title: " 가족신청",
    path: "/map",
    icon: <FontAwesomeIcon icon={faUserGroup} />,
  },
  {
    title: " 커뮤니티",
    path: "/community",
    icon: <FontAwesomeIcon icon={faComment} />,
  },
];
