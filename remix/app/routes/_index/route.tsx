import { Link } from "@remix-run/react";
import Scroller from "@/routes/_index/scroller";
import FeatureGrid from "@/routes/_index/feature_grid";
import MenuToggle from "@/routes/_index/menu_toggle";
import FAQ from "@/routes/_index/faq";
import logos from "/logos/logos.png";
import styles from "@/routes/_index/_index.module.css";
import { Suspense, useState } from "react";

export default function Index() {
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);

  const toggleNav = () => {
    setIsDropdownExpanded(!isDropdownExpanded);
  };

  return (
    <div className="color-white box-border flex min-h-screen w-full flex-col items-center bg-[var(--primary-dark)] font-[Geist]">
      <div className="sticky top-0 z-10 w-full pb-4">
        <div
          className={
            isDropdownExpanded
              ? "absolute top-0 h-[400px] w-full bg-transparent pt-[20px] opacity-100 backdrop-blur-xl md:h-[80px]"
              : "absolute top-0 box-border flex h-[70px] w-full items-center justify-center bg-transparent opacity-100 backdrop-blur-xl"
          }
        >
          <div className="flex h-[60px] w-full max-w-[1440px] flex-row items-center justify-between">
            <div className="flex items-center pl-[30px] text-2xl text-white">
              <h3>NaughtyML</h3>
            </div>
            {/* Displays on < 720px  */}
            <div className="inline-block cursor-pointer pr-[20px] md:hidden">
              <MenuToggle onToggle={toggleNav} />
            </div>
            {/* Displays on > 720px  */}
            <div className="hidden md:flex md:flex-row md:items-center md:gap-[40px] md:pr-[20px] md:text-white ">
              <Link
                to="/app"
                className="cursor-pointer py-[5px] text-center no-underline"
              >
                Blog
              </Link>
              <Link
                to="/app"
                className="cursor-pointer py-[5px] text-center no-underline "
              >
                Community
              </Link>
              <Link
                to="/app"
                className="w-[125px] cursor-pointer rounded-2xl bg-[var(--primary-accent)] py-[10px] text-center "
              >
                Launch App
              </Link>
            </div>
          </div>
          {isDropdownExpanded && (
            <div className={styles.dropdown_container}>
              <Link to="/app/chats" className={styles.dropdown_links}>
                Chats
              </Link>
              <Link to="/app/create" className={styles.dropdown_links}>
                Create
              </Link>
              <Link to="/app/explore" className={styles.dropdown_button}>
                Launch App
              </Link>
            </div>
          )}
          <hr className="margin-0 absolute bottom-0 h-[1px] w-full bg-white opacity-10 " />
        </div>
      </div>

      <div className="flex flex-col  pt-[80px] text-white md:items-center lg:max-w-[1440px] lg:flex-row lg:items-start lg:py-[8%]">
        <div className="flex max-w-[720px] flex-col items-start justify-center pl-[30px] pr-[40px] md:max-w-[750px] lg:w-[50%] lg:items-start lg:pt-[20px] lg:text-start">
          <h1 className="pb-[35px] text-4xl text-[var(--primary-light)] lg:text-6xl">
            Where Characters <br /> Do
            <span className="font-[Geist-Bold]"> Whatever</span> You Want
          </h1>
          <h3 className="pb-[25px] pt-0 font-[Geist-Light] text-2xl text-[var(--secondary-light)] lg:text-3xl ">
            Spicy conversation with your favorite characters, completely
            uncensored.
          </h3>
          <Link className="no_underline pt-[10px]" to="/app/create">
            <div className={styles.start_chatting_button}>
              <h4 className="text-lg lg:text-xl">Get Started</h4>
            </div>
          </Link>
        </div>
        <Scroller />
      </div>
      <div className={styles.feature_container}>
        <h1 className="font-[Geist-Bold] text-3xl text-white">FEATURES</h1>
        <FeatureGrid />
      </div>

      <div className={styles.faq_container}>
        <h1>Frequently Asked Questions</h1>
        <FAQ />
      </div>
      <div className={styles.footer_container}>Footer</div>
    </div>
  );
}
