"use client";
import { motion } from "framer-motion";
import styles from "./IntroScreen.module.css";

const particles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  emoji: ["💧", "🌱", "🍃", "✨", "🌿", "💦"][i % 6],
  x: Math.random() * 100,
  size: 0.5 + Math.random() * 1.4,
  dur: 5 + Math.random() * 8,
  delay: Math.random() * 6,
  drift: -50 + Math.random() * 100,
}));

const waterDrops = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: 5 + Math.random() * 90,
  delay: Math.random() * 3,
  duration: 1.2 + Math.random() * 1.8,
  angle: -30 + Math.random() * 60,
}));

export default function IntroScreen({ onNext }) {
  return (
    <motion.section
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Layered background */}
      <div className={styles.bg}>
        <div className={styles.bgSky} />
        <div className={styles.bgStars} />
        <div className={styles.bgFields} />
        <div className={styles.bgGlow} />
      </div>

      {/* Floating particles */}
      <div className={styles.particles}>
        {particles.map((p) => (
          <span
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              fontSize: `${p.size}rem`,
              "--dur": `${p.dur}s`,
              "--del": `${p.delay}s`,
              "--drift": `${p.drift}px`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Farmer scene */}
      <motion.div
        className={styles.farmerScene}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, type: "spring" }}
      >
        {/* Sun */}
        <div className={styles.sun}>☀️</div>

        {/* Clouds */}
        <div className={styles.clouds}>
          <span className={styles.cloud1}>☁️</span>
          <span className={styles.cloud2}>⛅</span>
        </div>

        {/* Farmer */}
        <motion.div
          className={styles.farmer}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          👨‍🌾
        </motion.div>

        {/* Sprinkler system */}
        <div className={styles.sprinklerArea}>
          <div className={styles.sprinklerHead}>
            <div className={styles.sprinklerPipe} />
            <div className={styles.sprinklerTop}>🚿</div>
          </div>
          <div className={styles.waterSpray}>
            {waterDrops.map((d) => (
              <div
                key={d.id}
                className={styles.sprayDrop}
                style={{
                  left: `${d.left}%`,
                  "--delay": `${d.delay}s`,
                  "--duration": `${d.duration}s`,
                  "--angle": `${d.angle}deg`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Field with crops */}
        <div className={styles.fieldContainer}>
          <div className={styles.fieldRow}>
            {"🌱🌿🌾🌱🌿🌾🌱🌿🌾🌱🌿".split("").map((e, i) => (
              <motion.span
                key={i}
                className={styles.plant}
                animate={{ y: [0, -4, 0], rotate: [0, 2, 0, -2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + Math.random(),
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              >
                {e}
              </motion.span>
            ))}
          </div>
          <div className={styles.soil} />
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
      >
        <div className={styles.logoArea}>
          <motion.div
            className={styles.dropIcon}
            animate={{
              y: [0, -14, 0],
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            💧
          </motion.div>
          <h1 className={styles.title}>JalSetu</h1>
          <p className={styles.tagline}>Smart Irrigation System</p>
          <p className={styles.subtitle}>Save Water · Grow More · Farm Smarter</p>
        </div>

        <motion.button
          className={styles.startBtn}
          onClick={onNext}
          whileHover={{ scale: 1.06, boxShadow: "0 12px 40px rgba(22,163,74,0.5)" }}
          whileTap={{ scale: 0.94 }}
          animate={{
            boxShadow: [
              "0 4px 24px rgba(22,163,74,0.3)",
              "0 8px 36px rgba(22,163,74,0.5)",
              "0 4px 24px rgba(22,163,74,0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>Get Started</span>
          <motion.span
            className={styles.arrow}
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Bottom wave decoration */}
      <div className={styles.waveDecor}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,50 1440,40 L1440,120 L0,120 Z"
            fill="rgba(34,197,94,0.08)"
          />
          <path
            d="M0,60 C320,20 640,90 960,50 C1200,20 1360,70 1440,60 L1440,120 L0,120 Z"
            fill="rgba(59,130,246,0.06)"
          />
        </svg>
      </div>
    </motion.section>
  );
}
