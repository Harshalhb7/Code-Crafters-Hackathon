"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import translations from "@/lib/translations";
import styles from "./LoginScreen.module.css";

export default function LoginScreen({ onLogin, lang }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const t = translations[lang];

  const handleSubmit = () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError(t.errorMobile);
      setTimeout(() => setError(""), 3000);
      return;
    }
    onLogin();
  };

  return (
    <motion.section
      className={styles.screen}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        <div className={styles.header}>
          <motion.div
            className={styles.avatar}
            animate={{ rotate: [0, 14, -8, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            👨‍🌾
          </motion.div>
          <h2 className={styles.title}>{t.loginTitle}</h2>
          <p className={styles.desc}>{t.loginDesc}</p>
        </div>

        <div className={styles.form}>
          <label className={styles.label}>{t.mobileLabel}</label>
          <div className={styles.inputWrap}>
            <span className={styles.prefix}>+91</span>
            <input
              type="tel"
              className={styles.input}
              placeholder="9876543210"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <p className={`${styles.hint} ${error ? styles.hintError : ""}`}>
            {error || t.inputHint}
          </p>

          <motion.button
            className={styles.loginBtn}
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.btnLogin} <span className={styles.arrow}>→</span>
          </motion.button>
        </div>

        <p className={styles.footer}>{t.loginFooter}</p>
      </motion.div>
    </motion.section>
  );
}
