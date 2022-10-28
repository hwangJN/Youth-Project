import styles from "./Practice.module.css";

function Practice() {
  return (
    //두개의 className이 적용되어 있지만 css 코드 순서에 따라 .grid만 적용됨(마지막에 실행 된).
    <div className={styles.body}>
      <h1 className={styles.title}>......제목입니다...........</h1>

      <div className={`${styles.grid}`}>
        <div className={styles.div}>GRID 스타일 NAVIGATION</div>
        <div className={styles.div}>
          <p>안녕하세요 asasasasasasasasasasasasasasas</p>
        </div>
      </div>
    </div>
  );
}

export default Practice;
