"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import translations from "@/lib/translations";
import styles from "./ScannerScreen.module.css";

function simulateAnalysis() {
  const moisture = 15 + Math.floor(Math.random() * 55);
  const conditions = ["Dry", "Moist", "Wet"];
  const colors = ["Dark Brown", "Reddish Brown", "Clay Red", "Sandy Yellow"];
  const healths = ["Healthy", "Moderate", "Needs Attention"];
  const condIdx = moisture < 30 ? 0 : moisture < 60 ? 1 : 2;
  return {
    moisture,
    condition: conditions[condIdx],
    color: colors[Math.floor(Math.random() * colors.length)],
    health: healths[Math.min(condIdx, healths.length - 1)],
  };
}

export default function ScannerScreen({ lang, onBack, onComplete }) {
  const t = translations[lang];
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
    setResults(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const startAnalysis = useCallback(() => {
    setAnalyzing(true);
    setTimeout(() => {
      const data = simulateAnalysis();
      setResults(data);
      setAnalyzing(false);
    }, 2500);
  }, []);

  const applyResults = useCallback(() => {
    if (!results) return;
    onComplete({
      moisture: results.moisture,
      condition: results.condition,
      color: results.color,
      health: results.health,
      imageUrl: image,
    });
  }, [results, image, onComplete]);

  const reset = () => {
    setImage(null);
    setImageFile(null);
    setResults(null);
    setAnalyzing(false);
  };

  return (
    <motion.section
      className={styles.screen}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <motion.button
            className={styles.backBtn}
            onClick={onBack}
            whileTap={{ scale: 0.9 }}
          >
            ← {t.soilLabel || "Back"}
          </motion.button>
          <h1 className={styles.title}>{t.scanTitle}</h1>
        </header>

        <p className={styles.desc}>{t.scanDesc}</p>

        {/* Upload Area */}
        {!image && (
          <motion.div
            className={`${styles.uploadArea} ${dragOver ? styles.dragActive : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className={styles.uploadIcon}>
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                📸
              </motion.span>
            </div>
            <p className={styles.uploadText}>{t.cameraHint}</p>
            <p className={styles.uploadHint}>Drag & drop or tap below</p>

            <div className={styles.uploadBtns}>
              <motion.button
                className={styles.captureBtn}
                onClick={() => fileRef.current?.click()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                📷 {t.capture}
              </motion.button>
              <motion.button
                className={styles.uploadBtn}
                onClick={() => fileRef.current?.click()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                📁 {t.upload}
              </motion.button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className={styles.hiddenInput}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </motion.div>
        )}

        {/* Image Preview */}
        <AnimatePresence>
          {image && (
            <motion.div
              className={styles.previewSection}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className={styles.previewCard}>
                <img src={image} alt="Soil preview" className={styles.previewImage} />
                <div className={styles.previewOverlay}>
                  {analyzing && (
                    <div className={styles.scanLine} />
                  )}
                </div>
              </div>

              {/* Actions */}
              {!analyzing && !results && (
                <div className={styles.previewActions}>
                  <motion.button
                    className={styles.retakeBtn}
                    onClick={reset}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 {t.retake}
                  </motion.button>
                  <motion.button
                    className={styles.analyzeBtn}
                    onClick={startAnalysis}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔬 {t.analyzing ? "Analyze Soil" : "Analyze"}
                  </motion.button>
                </div>
              )}

              {/* Analyzing State */}
              {analyzing && (
                <motion.div
                  className={styles.analyzingState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.loadingSpinner} />
                  <p className={styles.analyzingText}>{t.analyzing}</p>
                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.3, ease: "easeInOut" }}
                    />
                  </div>
                  <div className={styles.analyzingSteps}>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      ✓ Detecting soil texture...
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      ✓ Measuring moisture levels...
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      ✓ Analyzing color composition...
                    </motion.p>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              <AnimatePresence>
                {results && (
                  <motion.div
                    className={styles.resultsCard}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className={styles.resultsTitle}>{t.analysisTitle}</h3>

                    <div className={styles.metricsGrid}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricIcon}>💧</span>
                        <span className={styles.metricValue}>{results.moisture}%</span>
                        <span className={styles.metricLabel}>{t.moisture}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricIcon}>🌡️</span>
                        <span className={styles.metricValue}>{results.condition}</span>
                        <span className={styles.metricLabel}>{t.condition}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricIcon}>🎨</span>
                        <span className={styles.metricValue}>{results.color}</span>
                        <span className={styles.metricLabel}>{t.color}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricIcon}>🌱</span>
                        <span className={styles.metricValue}>{results.health}</span>
                        <span className={styles.metricLabel}>{t.health}</span>
                      </div>
                    </div>

                    {/* Moisture gauge */}
                    <div className={styles.gaugeArea}>
                      <div className={styles.gaugeBar}>
                        <motion.div
                          className={styles.gaugeFill}
                          initial={{ width: "0%" }}
                          animate={{ width: `${results.moisture}%` }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          style={{
                            background: results.moisture < 30
                              ? "linear-gradient(90deg, #ef4444, #f87171)"
                              : results.moisture < 60
                              ? "linear-gradient(90deg, #eab308, #facc15)"
                              : "linear-gradient(90deg, #22c55e, #4ade80)",
                          }}
                        />
                      </div>
                      <div className={styles.gaugeLabels}>
                        <span>Dry</span><span>Moist</span><span>Wet</span>
                      </div>
                    </div>

                    <div className={styles.resultActions}>
                      <motion.button
                        className={styles.retakeBtn}
                        onClick={reset}
                        whileTap={{ scale: 0.95 }}
                      >
                        🔄 {t.retake}
                      </motion.button>
                      <motion.button
                        className={styles.applyBtn}
                        onClick={applyResults}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✅ {t.applyToDash}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
