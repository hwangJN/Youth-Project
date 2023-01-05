import Typing from "../components/Typing";
import styles from "./Home.module.css";
//import { HomeItem } from "./HomeItem";

const Home = ({ userObj }) => {
  return (
    <>
      <div className={styles.container}>
        {/* 첫번째 장 */}
        <div
          className={styles.mainWrap}
          style={{
            backgroundImage: `url(${require("../img/메인1.jpg")})`,
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className={styles.mainContent}>
            <h1>
              <span className={styles.fontLarge}>보호종료청년</span>
              <span className={styles.fontSmaller}>을 위한</span> <br />
              <span className={styles.fontRight}>함께서기 울타리</span>
            </h1>
            <Typing
              text={"함께서기와 함께하는 가족신청을 통해"}
              text2={"서로의 울타리가 되어 따뜻한 마음을 나누어보세요"}
              speed={100}
            />{" "}
            {/* text, text2 이렇게 나눠서 말고 한꺼번에 줄바꿈 할 방법은 없나 */}
          </div>
        </div>

        {/* 두번째 장 */}
        <div className={styles.mainWrap3}>
          <span className={styles.Wrap3SubTitle}>
            " 이제 어떻게 살아가야 할까요? "
          </span>
          <div className={styles.mainContent3}>
            <h1>
              가족 맞춤형 <br />
              <span className={styles.fontLarge2}> 전담 어른 배치</span>
            </h1>
            <h2>
              전담 어른을 통해 언제든지 도움을 요청하여 <br />
              고민을 나누고 도움을 받을 수 있습니다.
            </h2>
          </div>
          <img src={require("../img/메인3.png")} className={styles.mainImg3} />
        </div>

        {/* 세번째 장 */}
        <div className={styles.mainWrap2}>
          <img src={require("../img/메인2.jpg")} className={styles.mainImg2} />
          <div className={styles.mainContent2}>
            <h1>
              <span className={styles.fontSmaller2}>청년들의 소통 공간</span>
              커뮤니티 제공
            </h1>
            <h2>
              우리가 사는 다양한 일상의 이야기를 나누며 <br />
              서로의 버팀목이 되어주세요.
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
