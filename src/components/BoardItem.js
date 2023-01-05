import { dbService } from "../fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./BoardItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCouch,
  faRectangleXmark,
  faShareFromSquare,
  faTableList,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const BoardItem = ({ itemObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(itemObj.textTitle);
  const [newContent, setNewContent] = useState(itemObj.textContent);
  const [newComment, setNewComment] = useState("");
  const boardRef = doc(dbService, "board", `${itemObj.id}`); //해당 id의 게시글 db
  const history = useHistory();

  useEffect(() => {
    //조회수+1
    const onViewsUp = async () => {
      await updateDoc(boardRef, {
        views: itemObj.views + 1,
      });
    };
    onViewsUp();
  }, []);

  //게시글 삭제
  const onDeleteClick = async () => {
    const ok = window.confirm("해당 커뮤니티를 삭제하시겠습니까?", "안내 내용");
    if (ok) {
      await deleteDoc(boardRef);
      history.push("/community");
    }
  };

  //댓글 삭제
  const onDeleteComment = async (event) => {
    event.preventDefault();
    const {
      target: { name },
    } = event;
    await updateDoc(boardRef, {
      comments: itemObj.comments.filter((item) => item.now !== Number(name)),
    });
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  //수정후 update
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(boardRef, {
      textTitle: newTitle,
      textContent: newContent,
    });
    setEditing(false);
    history.push("/community");
  };

  //댓글 등록
  const onCommentSubmit = async (event) => {
    event.preventDefault();
    const date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    await updateDoc(boardRef, {
      comments: [
        {
          comment: newComment,
          id: userObj.uid,
          now: Date.now(),
          date: `${year}/${month}/${day} ${hour}:${min}`,
        },
        ...itemObj.comments,
      ],
    });
    setNewComment("");
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "title") {
      setNewTitle(value);
    } else if (name === "content") {
      setNewContent(value);
    } else if (name === "comment") {
      setNewComment(value);
    }
  };

  return (
    <div className="boarditem">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="formBox">
            <div className="formHeader">
              <h2>커뮤니티 글 수정</h2>
              <div className="formBtns">
                <button type="submit">
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </button>
                <button type="button" onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faRectangleXmark} />
                </button>
              </div>
            </div>
            <div className="formContent">
              <input
                name="title"
                value={newTitle}
                onChange={onChange}
                type="text"
                maxLength={50}
                required
              />
              <textarea
                name="content"
                value={newContent}
                onChange={onChange}
                type="text"
                maxLength={300}
                required
              />
            </div>
          </form>
        </>
      ) : (
        <>
          {isOwner && (
            <div className="btnItems">
              <button onClick={onDeleteClick}>삭제</button>
              <button onClick={toggleEditing}>수정</button>
            </div>
          )}
          <div className="item">
            <h2 className="itemTitle">{itemObj.textTitle}</h2>
            <span className="itemDetail">
              {itemObj.date} 조회수 {itemObj.views}
            </span>
            <span className="itemContent">{itemObj.textContent}</span>
            <div className="itemInfo">
              <span className="itemShare">
                <FontAwesomeIcon
                  icon={faShareFromSquare}
                  className="itemIcon"
                />
                공유
              </span>
              <Link to="/community" className="itemLink">
                <FontAwesomeIcon icon={faTableList} className="itemIcon" />
                목록
              </Link>
            </div>
            <div className="commentBox">
              <span>댓글작성</span>
              <form onSubmit={onCommentSubmit} className="commentForm">
                <textarea
                  name="comment"
                  type="text"
                  placeholder="댓글을 입력하세요"
                  value={newComment}
                  onChange={onChange}
                  required
                ></textarea>
                <input type="submit" value="등록" />
              </form>

              <div className="advertisement">
                <div className="advIntro">
                  <h1>For you, 찾아가는 상담소 오픈</h1>
                  <span>지치고 힘든 당신을 위한</span>
                </div>
                <FontAwesomeIcon icon={faCouch} className="couchIcon" />
              </div>

              <div className="commentItems">
                {itemObj.comments.map((item, index) => {
                  return (
                    <div key={index} className="commentItem">
                      <div className="commentWriter">
                        <div className="writerProfile">
                          <div className="userIconWrap">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="userIcon"
                            />
                          </div>
                          {itemObj.creatorId === item.id ? (
                            <span>글쓴이</span>
                          ) : (
                            <span>익명</span>
                          )}
                        </div>
                        {/*댓글 삭제 - 본인 댓글이면 */}
                        {item.id === userObj.uid && (
                          <form onSubmit={onDeleteComment} name={item.now}>
                            <button type="submit">
                              <FontAwesomeIcon icon={faTrashCan} size="lg" />
                            </button>
                          </form>
                        )}
                      </div>
                      <span>{item.comment}</span>
                      <span className="commentDate">{item.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardItem;
