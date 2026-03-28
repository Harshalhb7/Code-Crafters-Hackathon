"use client";
import { motion } from "framer-motion";
import styles from "./LanguageScreen.module.css";

const languages = [
  { code: "en", label: "English", native: "English", icon: "🇬🇧", desc: "Continue in English" },
  { code: "hi", label: "हिंदी", native: "Hindi", icon: "🇮🇳", desc: "हिंदी में जारी रखें" },
  { code: "mr", label: "मराठी", native: "Marathi", icon: "🇮🇳", desc: "मराठीत पुढे चला" },
];

export default function LanguageScreen({ onSelect }) {
  return (
    <motion.section
      className={styles.screen}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background waterdrops */}
      <div className={styles.bgDrops}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className={styles.bgDrop}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${5 + Math.random() * 85}%`,
              fontSize: `${1 + Math.random() * 2}rem`,
              "--delay": `${Math.random() * 4}s`,
              "--dur": `${4 + Math.random() * 4}s`,
            }}
          >
            💧
          </span>
        ))}
      </div>

      <div className={styles.inner}>
        {/* Decorative corner elements */}
        <div className={styles.cornerTL}>🌿</div>
        <div className={styles.cornerTR}>🌿</div>
        <div className={styles.cornerBL}>🌾</div>
        <div className={styles.cornerBR}>🌾</div>

        {/* Logo */}
        <motion.div
          className={styles.logo}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <motion.div
            className={styles.dropIcon}
            animate={{ y: [0, -14, 0], scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            💧
          </motion.div>
          <h1 className={styles.appName}>JalSetu</h1>
          <p className={styles.appSub}>Smart Irrigation System</p>
        </motion.div>

        {/* Prompt */}
        <motion.div
          className={styles.promptArea}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className={styles.promptIcon}>🌐</div>
          <p className={styles.prompt}>Choose your language</p>
          <p className={styles.promptHint}>भाषा चुनें · भाषा निवडा</p>
        </motion.div>

        {/* Language buttons */}
        <div className={styles.buttons}>
          {languages.map((lang, i) => (
            <motion.button
              key={lang.code}
              className={styles.langBtn}
              onClick={() => onSelect(lang.code)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className={styles.langFlag}>{lang.icon}</span>
              <div className={styles.langText}>
                <span className={styles.langLabel}>{lang.label}</span>
                <span className={styles.langDesc}>{lang.desc}</span>
              </div>
              <span className={styles.langArrow}>→</span>
            </motion.button>
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          className={styles.footerHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          🌱 Simple & easy for every farmer
        </motion.p>
      </div>
    </motion.section>
  );
}
