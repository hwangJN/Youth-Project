import { useHistory, useParams } from "react-router";
import styles from "./ApplyContent.module.css";

import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { dbService } from "../fbase";
import { useState } from "react";
import { useEffect } from "react";
import ApplyContent_Detail from "../components/ApplyContentDetail";
import ApplyContentDetail from "../components/ApplyContentDetail";

const ApplyContent = ({ userObj }) => {
  //폼 상세 페이지
  const { id } = useParams(); //path="/board/:id"
  const q1 = query(
    collection(dbService, "Family"),
    where("complete", "==", false)
  ); //보호종료
  const [fmyarray, setFmyArray] = useState([]);
  useEffect(() => {
    onSnapshot(q1, (snapshot) => {
      const familyarray = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));
      setFmyArray(familyarray);
    });
  }, []);

  return (
    <div>
      {fmyarray.map((item) => {
        if (item.id === id) {
          return (
            <ApplyContentDetail
              userObj={userObj}
              applyObject={item}
              sGu={item.seoulGu}
            />
          );
        }
      })}
    </div>
  );
};

export default ApplyContent;
