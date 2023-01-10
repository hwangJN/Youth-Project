import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { dbService } from "../fbase";
import styles from "../routes/Apply.module.css";
import "../routes/Map.css";

const ApplyWriteBtn = ({
  className,
  isLoggedIn,
  userObj,
  setAlreadySubmit2,
  setIsAdult2,
  sGu,
}) => {
  const [alreadySubmit, setAlreadySubmit] = useState(false); //이미 폼 만든 사람인지
  const [isAdult, setIsAdult] = useState(false);
  const history = useHistory();
  useEffect(() => {
    let userRef = null;
    if (isLoggedIn) userRef = doc(dbService, "userObj", `${userObj.uid}`);

    //이미 신청한 사람인지 + 전담어른인지
    const already = async () => {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        if (userSnap.data().applyForm) {
          setAlreadySubmit(true);
          setAlreadySubmit2(true);
        }
        if (userSnap.data().userObject.protect === "adult") {
          setIsAdult(true);
          setIsAdult2(true);
        }
      }
    };
    if (userRef) already();
  }, []);

  const onClick = () => {
    if (isLoggedIn) {
      if (alreadySubmit) {
        alert("이미 신청 되었습니다.");
      } else if (isAdult) {
        alert("전담어른은 신청할 수 없습니다.");
      } else {
        history.push({ pathname: "/applywrite", state: { sGu: sGu } });
      }
    } else {
      alert("로그인 후 이용해 주세요.");
    }
  };
  return (
    <button className={className} onClick={onClick}>
      가족신청
    </button>
  );
};

export default ApplyWriteBtn;
