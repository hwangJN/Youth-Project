import "./CommunityWriting.css";
import React, { useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//게시글 작성
const CommunityWriting = ({ isLoggedIn, userObj }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const history = useHistory();

  //게시글 등록
  const onSubmit = async (event) => {
    event.preventDefault();
    const date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    await addDoc(collection(dbService, "board"), {
      textTitle: title, //제목
      textContent: content, //내용
      date: `${year}/${month}/${day} ${hour}:${min}`, //작성일
      creatorId: userObj.uid, //게시글 작성자
      createdAt: Date.now(),
      views: 0, //조회수
      comments: [], //댓글
    });
    setTitle("");
    setContent("");
    history.push("/community"); //게시글 등록시 다시 커뮤니티로 복귀
  };
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "title") {
      setTitle(value);
    } else if (name === "content") {
      setContent(value);
    }
  };
  console.log(isLoggedIn);
  return (
    <>
      {isLoggedIn ? (
        <div className="writingBox">
          <form onSubmit={onSubmit} className="formBox">
            <div className="formHeader">
              <h2>커뮤니티 글쓰기</h2>
              <button type="submit">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
            <div className="formContent">
              <input
                name="title"
                value={title}
                onChange={onChange}
                type="text"
                placeholder="글 제목을 입력해주세요"
                maxLength={50}
                required
              />
              <textarea
                name="content"
                value={content}
                onChange={onChange}
                type="text"
                placeholder="내용을 작성하세요"
                maxLength={300}
                required
              />
            </div>
          </form>
        </div>
      ) : (
        <div className="warning">
          <h2>로그인시 글 작성이 가능합니다.</h2>
        </div>
      )}
    </>
  );
};

export default CommunityWriting;
