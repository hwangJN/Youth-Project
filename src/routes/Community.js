import "./Community.css";
import { dbService } from "../fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBarsStaggered,
  faBookmark,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";

const Community = () => {
  const [board, setBoard] = useState([]);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(12);
  useEffect(() => {
    const q = query(
      collection(dbService, "board"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const boardArr = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));
      setBoard(boardArr);
    });
  }, []);
  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="board">
      <div className="boardName">
        <FontAwesomeIcon icon={faBarsStaggered} className="barsIcon" />
        <h1>커뮤니티</h1>
      </div>
      <div className="boardListWrap">
        <ul className="boardList">
          <li>
            <ul className="boardListTop">
              <li>No</li>
              <li>제목</li>
              <li>작성일</li>
              <li>조회</li>
            </ul>
          </li>
          {board
            .slice(items * (page - 1), items * (page - 1) + items)
            .map((item, index) => (
              <li key={item.id} className="boardListContent">
                <span>{board.length - index - items * (page - 1)}</span>
                <span>
                  <Link to={`/board/${item.id}`}>{item.textTitle}</Link>
                </span>
                <span>{item.date}</span>
                <span>{item.views}</span>
              </li>
            ))}
        </ul>
        <div className="writingBtn">
          <Link to="/communityWriting" className="writing">
            <FontAwesomeIcon icon={faPenToSquare} />
            <span>글쓰기</span>
          </Link>
        </div>
        <footer>
          <Pagination
            activePage={page}
            itemsCountPerPage={items}
            totalItemsCount={board.length}
            pageRangeDisplayed={Math.ceil(board.length / items)}
            onChange={handlePageChange}
            prevPageText="‹"
            nextPageText="›"
          ></Pagination>
        </footer>
      </div>
    </div>
  );
};
export default Community;
