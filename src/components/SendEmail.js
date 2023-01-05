import React, { useState } from "react";
import styles from "./ProfileUpdate.module.css";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emailjs from "@emailjs/browser";
function SendEmail({ needAdult, adultEmail, applyerEmail }) {
  const [message, setMessage] = useState("");
  const form = useRef();

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setMessage(value);
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
    alert("메일을 전송하였습니다.");
    setMessage("");
  };

  return (
    <form className={styles.mailForm} ref={form} onSubmit={sendEmail}>
      <h3>
        <FontAwesomeIcon icon={faEnvelope} className={styles.mailIcon} />
        {needAdult ? "전담어른" : "팀장"}에게 메일 보내기
      </h3>
      <div className={styles.mailDiv}>
        <label>To. </label>
        {needAdult ? (
          <input
            readOnly
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
        <input type="submit" value="메일 전송" className={styles.mailBtn} />
      </div>
    </form>
  );
}
export default SendEmail;
