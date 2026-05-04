import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import logo from "../assets/bayax.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import UserProfilebtn from "./UserProfilebtn";
import { userProfileState } from "../recoil/createUser.recoil";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Pricing", url: "/pricing" },
  { name: "Faq", url: "/faq" },
];

const NavBar = () => {
  const navBarAnimation = {
    initial: { opacity: 0, y: -20 },
    inView: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const [isNavbar, setIsNavbar] = useState(window.innerWidth < 769);
  const [toggleMenu, setToggleMenu] = useState(false);

  const menu = useCallback(() => {
    setIsNavbar(window.innerWidth < 769);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", menu);
    if (toggleMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      window.removeEventListener("resize", menu);
      document.body.style.overflow = "auto";
    };
  }, [menu, toggleMenu]);

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("username");
    setUserProfile(isAuthenticated);
  }, [setUserProfile]);

  return (
    <motion.div
      variants={navBarAnimation}
      initial="initial"
      whileInView="inView"
      className="flex justify-between items-center sm:px-16 px-6 py-6 text-xl relative z-50 font-medium text-slate-900 dark:text-slate-200"
    >
      <div>
        <Link to="/">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain border border-slate-200 dark:border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-500/10 bg-white p-1" />
        </Link>
      </div>
      {!isNavbar ? (
        <>
          <ul className="flex gap-10">
            {navLinks.map((nav) => (
              <li
                key={nav.name}
                className="transition-all duration-200 hover:text-cyan-400 hover:scale-105"
              >
                <Link to={nav.url} className="text-slate-800 dark:text-slate-200">{nav.name}</Link>
              </li>
            ))}
            {userProfile && (
              <li className="transition-all duration-200 hover:text-cyan-400 hover:scale-105">
                <Link to="/history" className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <FontAwesomeIcon icon={faClockRotateLeft} className="text-sm" />
                  History
                </Link>
              </li>
            )}
          </ul>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {userProfile ? (
              <UserProfilebtn />
            ) : (
              <Link to="/auth/signin">
                <button className="transition-all duration-200 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500 p-2 px-6 rounded-xl border border-slate-600 text-sm text-slate-800 dark:text-slate-200">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="flex gap-5 items-center">
          <ThemeToggle />
          {userProfile ? (
            <UserProfilebtn />
          ) : (
            <Link to="/auth/signin">
              <button className="transition-all duration-200 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500 p-2 px-4 rounded-xl border border-slate-600 text-sm text-slate-800 dark:text-slate-200">
                Sign In
              </button>
            </Link>
          )}

          <button onClick={() => setToggleMenu(!toggleMenu)} className="text-slate-800 dark:text-slate-200 hover:text-cyan-400 transition-colors">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>
      )}
      {isNavbar && toggleMenu && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center space-y-8">
          <button onClick={() => setToggleMenu(!toggleMenu)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faXmark} size="2x" />
          </button>
          <ul className="text-center space-y-8">
            {navLinks.map((nav) => (
              <li key={nav.name}>
                <Link
                  to={nav.url}
                  onClick={() => setToggleMenu(false)}
                  className="text-2xl font-light text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  {nav.name}
                </Link>
              </li>
            ))}
            {userProfile && (
              <li>
                <Link
                  to="/history"
                  onClick={() => setToggleMenu(false)}
                  className="text-2xl font-light text-slate-300 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faClockRotateLeft} className="text-lg" />
                  History
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default NavBar;
