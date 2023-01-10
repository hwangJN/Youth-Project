import { useParams } from "react-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { dbService } from "../fbase";
import { useState } from "react";
import { useEffect } from "react";
import ApplyContentDetail from "../components/ApplyContentDetail";

const ApplyContent = ({ userObj }) => {
  //폼 상세 페이지
  const { id } = useParams(); //path="/board/:id"
  const q1 = query(
    collection(dbService, "Family"),
    where("complete", "==", false)
  );
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
      {fmyarray.map((item, key) => {
        if (item.id === id) {
          return <ApplyContentDetail userObj={userObj} applyObject={item} />;
        }
      })}
    </div>
  );
};

export default ApplyContent;
