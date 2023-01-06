import React, { useEffect, useState } from "react";
import styles from "./Board.module.css";
import { dbService } from "../fbase";
import { query, collection, onSnapshot } from "firebase/firestore";

import { useParams } from "react-router-dom";
import BoardItem from "./BoardItem";

const Board = ({ isLoggedIn, userObj }) => {
  const [board, setBoard] = useState([]);
  const { id } = useParams(); //path="/board/:id"
  useEffect(() => {
    const q = query(collection(dbService, "board"));
    onSnapshot(q, (snapshot) => {
      const boardArr = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));
      setBoard(boardArr);
    });
  }, []);
  return (
    <div className={styles.board}>
      {isLoggedIn ? (
        <>
          {board.map((item) => {
            if (item.id === id) {
              return (
                <BoardItem
                  itemObj={item}
                  key={item.id}
                  isOwner={item.creatorId === userObj.uid}
                  userObj={userObj}
                />
              );
            }
          })}
        </>
      ) : (
        <>
          <div className={styles.warning}>
            <h2>로그인 후 이용해주세요.</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default Board;
