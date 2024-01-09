import { Suspense, useEffect } from "react";
import styles from "@/routes/_index/_index.module.css";

const Scroller: React.FC = () => {
  useEffect(() => {
    const scrollers = document.querySelectorAll(`.${styles.scroller}`);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", "true");

        const scrollerInner = scroller.querySelector(
          `.${styles.scroller__inner}`,
        );
        const scrollerContent = Array.from(scrollerInner!.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true) as HTMLElement;
          duplicatedItem.setAttribute("aria-hidden", "true");
          scrollerInner?.appendChild(duplicatedItem);
        });
      });
    }
  }, []);

  return (
    <div className="box-border grid max-w-[1200px] p-[30px] md:max-w-[800px] lg:w-[50%] lg:pl-[20px]">
      <div className={styles.scroller} data-speed="slow">
        <div className={styles.scroller__inner}>
          <ul className={`${styles.tag_list} ${styles.scroller__inner}`}>
            <img id="1" src="/images/image1.jpeg" alt="" />
            <img id="2" src="/images/image2.jpeg" alt="" />
            <img id="3" src="/images/image3.jpeg" alt="" />
            <img id="4" src="/images/image4.jpeg" alt="" />
            <img id="5" src="/images/image5.jpeg" alt="" />
            <img id="6" src="/images/image6.jpeg" alt="" />
            <img id="7" src="/images/image7.jpeg" alt="" />
          </ul>
        </div>
      </div>

      <div className={styles.scroller} data-direction="right" data-speed="slow">
        <div className={styles.scroller_bottom}>
          <div className={styles.scroller__inner}>
            <ul className={`${styles.tag_list} ${styles.scroller__inner}`}>
              <img id="8" src="/images/image8.jpeg" alt="" />
              <img id="9" src="/images/image9.jpeg" alt="" />
              <img id="10" src="/images/image10.jpeg" alt="" />
              <img id="11" src="/images/image11.jpeg" alt="" />
              <img id="12" src="/images/image12.jpeg" alt="" />
              <img id="13" src="/images/image13.jpeg" alt="" />
              <img id="14" src="/images/image14.jpeg" alt="" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scroller;
