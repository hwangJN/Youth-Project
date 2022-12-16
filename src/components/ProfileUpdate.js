import {
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { dbService } from "../fbase";
import styles from "./ProfileUpdate.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faX,
  faCircleExclamation,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import { useRef } from "react";
import emailjs from "@emailjs/browser";

function ProfileUpdate({ userObj, refreshUserObj }) {
  const history = useHistory();

  //프로필
  const [newDisplayName, setNewDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("man");
  const [protect, setProtect] = useState("protect");

  //나의 가족 확인
  const [seoulGu, setSeoulGu] = useState("");
  const [seoulDong, setSeoulDong] = useState("");
  const [needAdult, setNeedAdult] = useState(false);
  const [numofFmy, setNumofFmy] = useState();
  const [complete, setComplete] = useState();
  const [applyer, setApplyer] = useState([]);
  const [applyerEmail, setApplyerEmail] = useState([]);
  const [adultEmail, setAdultEmail] = useState([]);
  const [applyerModi, setApplyerModi] = useState([]);
  const [adultNickname, setAdultNickname] = useState("");

  //const [nickName, setNickName] = useState([]);

  //toggle
  const [myFmyBtn, setMyFmyBtn] = useState(false); //프로필인지 나의가족확인인지
  const [loading, setLoading] = useState(true);
  const [existForm, setExistForm] = useState(false); //폼이 존재하는지 아닌지
  const [isApplyer, setIsApplyer] = useState(false); //폼 작성자인지 아닌지(취소 여부)
  //const [isAdult, setIsAdult] = useState(false); //폼 작성자인지 아닌지(취소 여부)

  const form = useRef();
  // applyerEmailString = "";
  const [message, setMessage] = useState("");
  const [deliver, setDeliver] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
      const userObjSnap = await getDoc(userObjRef);
      let collection = "";
      collection = userObjSnap.data().userObject;
      if (userObjSnap.exists()) {
        setAge(collection.age);
        setSex(collection.sex);
        setProtect(collection.protect);
        setNewDisplayName(collection.nickname);
      }
    };

    getUser();
  }, []);
  useEffect(() => {
    const getUser = async () => {
      const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
      const userObjSnap = await getDoc(userObjRef);
      let applyform = userObjSnap.data().applyForm;
      if (applyform === userObj.uid) {
        setIsApplyer(true);
      }
      const applyObjRef = doc(dbService, "Family", `${applyform}`); //Family obj를 찾음
      const docSnap = await getDoc(applyObjRef);

      if (docSnap.exists()) {
        if (docSnap.data().complete) setComplete(true);
        setLoading(false);
        setExistForm(true);
        setApplyer(docSnap.data().applyList);
        setApplyerEmail(docSnap.data().applyList_email);
        setApplyerModi(docSnap.data().applyList);
        setSeoulGu(docSnap.data().seoulGu);
        setSeoulDong(docSnap.data().seoulDong);
        setNeedAdult(docSnap.data().needAdult);
        setNumofFmy(docSnap.data().numofFmy);
        setAdultNickname(docSnap.data().audultNickname);
        setAdultEmail(docSnap.data().adultEmail);
      } else {
        setExistForm(false);
        setLoading(false);
      }
    };
    getUser();
  }, []);
  //applyerEmailString = JSON.stringify(applyerEmail);
  //console.log(applyerEmailString);
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "Name") {
      setNewDisplayName(value);
    } else if (name === "Age") {
      setAge(value);
    } else if (name === "message") {
      setMessage(value);
    }
  };
  const goToProfileUpdateComplete = () => {
    alert("수정되었습니다.");
    history.push("/");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const userObject = {
      userId: userObj.uid,
      createdAt: Date.now(),
      nickname: newDisplayName,
      age,
      sex,
      protect,
    };

    await setDoc(doc(dbService, "userObj", `${userObj.uid}`), {
      userObject,
    }).then((data) => {
      goToProfileUpdateComplete();
    });
    refreshUserObj();
  };

  const onSelect = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "sex") {
      setSex(value);
    } else if (name === "protect") {
      setProtect(value);
    }
  };
  //내 신청내역 취소하기
  const cancelApply = () => {
    const getUser = async () => {
      const userObjRef = doc(dbService, "userObj", `${userObj.uid}`);
      const userObjSnap = await getDoc(userObjRef);
      let applyform = userObjSnap.data().applyForm;
      const applyObjRef = doc(dbService, "Family", `${applyform}`); //Family obj를 찾음
      const docSnap = await getDoc(applyObjRef);
      let nickname = userObjSnap.data().userObject.nickname;
      console.log(nickname);
      //let restOfFmy_num = docSnap.data().restOfFmy;
      if (docSnap.exists()) {
        //내 userObj 에서 신청 내역 삭제
        await updateDoc(userObjRef, {
          applyForm: deleteField(),
        });
        //setApplyerModi();
        //폼 obj의 신청자 list에서 내 아이디 삭제후 남은 인원 update
        await updateDoc(applyObjRef, {
          restOfFmy: docSnap.data().restOfFmy + 1,
          applyList: applyerModi.filter((Element) => Element !== nickname),
          //applyList: deleteField(),
          // deleteField(),
        }).then(() => {
          history.push("/");
        });
      }
    };
    getUser();
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_uxhhzfm",
        "template_3ch0w59",
        form.current,
        "aUmiL7gzyiGW3owjQ"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    setDeliver(true);
    alert("메일을 전송하였습니다.");
    //window.location.replace("/profile");
  };
  return (
    <div className={styles.container}>
      {/*myFmyBtn : 프로필 or 나의 가족 신청 버튼 Click */}
      {!myFmyBtn ? (
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.titleDiv}>
            <FontAwesomeIcon className={styles.icon} icon={faUser} />
            <span className={styles.h1}>프로필</span>
            <button
              className={styles.myApplyBtn}
              onClick={() => {
                setMyFmyBtn((prev) => !prev);
              }}
            >
              나의 가족
            </button>
          </div>

          <span className={styles.span}>
            - 모든 항목 필수 기입해 주시기 바랍니다.
          </span>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>이메일</th>
                <td>
                  <input
                    className={styles.input}
                    type="text"
                    name="email"
                    disabled
                    value={userObj.email}
                  />
                </td>
              </tr>
              <tr>
                <th>이름</th>
                <td>
                  <input
                    className={styles.input}
                    name="Name"
                    onChange={onChange}
                    type="text"
                    placeholder="이름"
                    required
                    value={newDisplayName}
                  />
                </td>
              </tr>
              <tr>
                <th>나이</th>
                <td>
                  <input
                    className={styles.input}
                    name="Age"
                    onChange={onChange}
                    type="text"
                    placeholder="O세"
                    value={age}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>성별</th>
                <td>
                  <select
                    value={sex}
                    name="sex"
                    onChange={onSelect}
                    className={styles.select_sex}
                  >
                    <option value="man">남</option>
                    <option value="woman">여</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>신분</th>
                <td>
                  <select
                    value={protect}
                    name="protect"
                    onChange={onSelect}
                    className={styles.select}
                  >
                    <option value="protected" className={styles.option}>
                      보호종료청년
                    </option>
                    <option value="adult" className={styles.option}>
                      전담어른
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <input type="submit" value="수정하기" className={styles.submitBtn} />
        </form>
      ) : (
        <div className={styles.fmyAndEmail}>
          <div className={styles.form}>
            {/* 신청 내역이 있을 경우 or 없을 경우 */}
            {/* 신청 내역이 있을 때 */}
            {!loading && existForm && (
              <>
                <div className={styles.titleDiv}>
                  <img
                    src={require(`../img/인덱스3.png`)}
                    className={styles.index}
                  />
                  <span className={styles.h1}> 나의 가족 신청</span>
                  <button
                    className={styles.gotoProfileBtn}
                    onClick={() => {
                      setMyFmyBtn((prev) => !prev);
                    }}
                  >
                    프로필
                  </button>
                </div>

                <form>
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        <th>지역</th>
                        <td>
                          <span className={styles.td}>
                            서울특별시 {seoulGu} {seoulDong}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>인원수</th>
                        <td>
                          <span className={styles.td}>{numofFmy}명</span>
                        </td>
                      </tr>
                      <tr>
                        <th>현재 가족</th>
                        <td>
                          <ul className={styles.ul}>
                            {applyer.map((nickName, idx) => {
                              return (
                                <li className={styles.li} key={idx}>
                                  {nickName}
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <th>가족 이메일</th>
                        <td>
                          <ul className={styles.ul_mail}>
                            {applyerEmail.map((mail, idx) => {
                              return (
                                <li className={styles.li_mail} key={idx}>
                                  {mail}
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                      </tr>

                      <tr>
                        <th>전담어른 여부</th>
                        <td>
                          <span className={styles.td}>
                            {needAdult ? (
                              <>
                                <FontAwesomeIcon
                                  className={styles.OorX}
                                  icon={faCircle}
                                />
                                <span className={styles.adultName}>
                                  <span>{adultNickname}</span>
                                </span>
                              </>
                            ) : (
                              <>
                                <FontAwesomeIcon
                                  className={styles.OorX}
                                  icon={faX}
                                />
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>가족 결성 여부</th>
                        <td>
                          <span className={styles.td}>
                            {complete ? (
                              <>
                                <FontAwesomeIcon
                                  className={styles.OorX}
                                  icon={faCircle}
                                />
                              </>
                            ) : (
                              <>
                                <FontAwesomeIcon
                                  className={styles.OorX}
                                  icon={faX}
                                />
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* 폼 작성자가 아닌 경우 취소하기 */}
                  {!isApplyer ? (
                    <>
                      {!complete ? (
                        <button
                          className={styles.submitBtn}
                          onClick={cancelApply}
                        >
                          취소하기
                        </button>
                      ) : null}
                    </>
                  ) : null}
                  {/* 메일전송버튼 */}
                </form>
              </>
            )}
            {/* 신청한 가족이 없을 때 */}
            {!loading && !existForm && (
              <>
                <div className={styles.noFmy}>
                  <FontAwesomeIcon
                    className={styles.noFmyIcon}
                    icon={faCircleExclamation}
                  />
                  <h3 className={styles.noFmyText}>신청한 가족이 없습니다</h3>
                  <button
                    className={styles.gotoProfileBtn_2}
                    onClick={() => {
                      setMyFmyBtn((prev) => !prev);
                    }}
                  >
                    프로필
                  </button>
                </div>
              </>
            )}
            {/* 로딩중 */}
            {loading && (
              <>
                <div className={styles.noFmy}>
                  <h1>Loading..</h1>
                </div>
              </>
            )}
          </div>
          {complete && myFmyBtn && !(protect === "adult") ? (
            <form className={styles.mailForm} ref={form} onSubmit={sendEmail}>
              <h3>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className={styles.mailIcon}
                />
                {needAdult ? "전담어른" : "팀장"}에게 메일 보내기
              </h3>
              <div className={styles.mailDiv}>
                <label>To. </label>
                {needAdult ? (
                  <input
                    className={styles.mail}
                    name="toEmail"
                    value={adultEmail}
                  />
                ) : (
                  <input name="toEmail" value={applyerEmail[0]} />
                )}
              </div>
              <textarea
                className={styles.mailContent}
                placeholder="메일 내용을 입력하세요"
                name="message"
                value={message}
                required
                onChange={onChange}
              />
              <div className={styles.mailBtnDiv}>
                <input
                  type="submit"
                  value="메일 전송"
                  className={styles.mailBtn}
                />
              </div>

              {deliver && (
                <div className={styles.deliver}>
                  <span>전송 완료</span>
                </div>
              )}
            </form>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ProfileUpdate;
