"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import translations, { cropDatabase } from "@/lib/translations";
import styles from "./Dashboard.module.css";

const condIcons = { clear: "☀️", cloudy: "☁️", rain: "🌧️", drizzle: "🌦️", storm: "⛈️", fog: "🌫️", unknown: "🌤️" };

function getWmoCondition(code) {
  if (code <= 1) return "clear";
  if (code <= 3) return "cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 82) return "rain";
  if (code >= 95) return "storm";
  return "unknown";
}

function condLabel(cond, t) {
  const m = { clear: t.condClear, cloudy: t.condCloudy, rain: t.condRain, drizzle: t.condDrizzle, storm: t.condStorm, fog: t.condFog };
  return m[cond] || cond;
}

/* Circular progress for confidence */
function ConfidenceRing({ value, color }) {
  const r = 40, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const colors = {
    green: { stroke: "#22c55e", glow: "rgba(34,197,94,0.3)" },
    yellow: { stroke: "#eab308", glow: "rgba(234,179,8,0.3)" },
    red: { stroke: "#ef4444", glow: "rgba(239,68,68,0.3)" },
  };
  const col = colors[color] || colors.green;
  return (
    <div className={styles.ringWrap}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={col.stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${col.glow})`, transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
      </svg>
      <div className={styles.ringText}>
        <span className={styles.ringValue}>{value}%</span>
      </div>
    </div>
  );
}

export default function Dashboard({
  lang, soilData, selectedCrop, setSelectedCrop,
  weatherData, setWeatherData, onScanSoil, onLogout,
}) {
  const t = translations[lang];
  const [location, setLocation] = useState(t.locationDetecting);
  const [cropModal, setCropModal] = useState(false);
  const [tempCrop, setTempCrop] = useState(selectedCrop);
  const crop = cropDatabase.find((c) => c.id === selectedCrop);

  // Greeting
  const hour = new Date().getHours();
  const greet = hour < 12 ? t.greetMorning : hour < 17 ? t.greetAfternoon : t.greetEvening;

  // Fetch weather
  useEffect(() => {
    if (weatherData) return;
    const fetchWeather = async (lat, lon) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        const c = data.current;
        const hp = data.hourly?.precipitation_probability || [];
        const h = new Date().getHours();
        let maxRain = 0;
        for (let i = h; i < Math.min(h + 6, hp.length); i++) maxRain = Math.max(maxRain, hp[i] || 0);
        setWeatherData({
          temp: Math.round(c.temperature_2m), humidity: c.relative_humidity_2m,
          rain: c.rain, code: c.weather_code, wind: Math.round(c.wind_speed_10m),
          rainChance: maxRain, condition: getWmoCondition(c.weather_code),
        });
        const tz = data.timezone || "";
        setLocation(tz.split("/").pop().replace(/_/g, " ") || `${lat.toFixed(1)}°N`);
      } catch { useFallback(); }
    };
    const useFallback = () => {
      setWeatherData({ temp: 34, humidity: 45, rain: 0, code: 0, wind: 12, rainChance: 15, condition: "clear" });
      setLocation("Pune, India");
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetchWeather(p.coords.latitude, p.coords.longitude),
        () => { fetchWeather(18.52, 73.86); setLocation("Pune, India (default)"); },
        { timeout: 8000 }
      );
    } else { useFallback(); }
  }, [weatherData, setWeatherData]);

  // Decision engine
  const moisture = soilData?.moisture ?? 20;
  const rainChance = weatherData?.rainChance ?? 0;
  const isRaining = weatherData?.condition === "rain" || weatherData?.condition === "storm";
  let decision = "irrigate", confidence = 80;
  if (isRaining || rainChance > 70) { decision = "stop"; confidence = 88; }
  else if (rainChance > 40 || moisture > 60) { decision = "wait"; confidence = 72; }
  else if (moisture < 35) { decision = "irrigate"; confidence = 87; }
  else { decision = "wait"; confidence = 65; }
  if (crop) {
    if (crop.waterNeed === "high" && decision === "wait") { decision = "irrigate"; confidence -= 8; }
    if (crop.waterNeed === "low" && decision === "irrigate" && moisture > 25) { decision = "wait"; confidence -= 5; }
  }
  confidence = Math.min(confidence, 98);

  const decTitle = decision === "irrigate" ? t.irrigateTitle : decision === "wait" ? t.waitTitle : t.stopTitle;
  const decReason = decision === "irrigate" ? t.irrigateReason : decision === "wait" ? t.waitReason : t.stopReason;
  const decColor = decision === "irrigate" ? "green" : decision === "wait" ? "yellow" : "red";
  const decEmoji = decision === "irrigate" ? "✅" : decision === "wait" ? "⏳" : "🚫";

  // Smart insights
  const insights = [];
  if (soilData) {
    insights.push({
      dot: moisture < 35 ? "red" : "green",
      icon: moisture < 35 ? "🏜️" : "🌿",
      text: moisture < 35 ? `${t.soilLabel}: ${moisture}% — ${t.soilDryDetail}` : `${t.soilLabel}: ${moisture}% — ${t.soilMoistDetail}`,
    });
  } else {
    insights.push({ dot: "red", icon: "⚠️", text: t.insight1 });
  }
  if (weatherData) {
    const rc = weatherData.rainChance;
    insights.push({
      dot: rc > 60 ? "green" : rc > 30 ? "yellow" : "red",
      icon: rc > 60 ? "🌧️" : "☀️",
      text: `${t.wRain}: ${rc}%`,
    });
  } else {
    insights.push({ dot: "yellow", icon: "⏳", text: t.insight2 });
  }
  insights.push({
    dot: "green",
    icon: crop?.emoji || "🌾",
    text: crop ? `${crop.name[lang]} — ${crop.waterNeed} water need` : t.insight3,
  });

  const w = weatherData;

  const recommendedCrops = weatherData
    ? cropDatabase.filter((c) => w.temp >= c.idealTemp[0] && w.temp <= c.idealTemp[1] && w.humidity >= c.idealHumidity[0] && w.humidity <= c.idealHumidity[1]).map((c) => c.id)
    : [];

  // Water saved estimate
  const waterSaved = decision !== "irrigate" ? "2,400 L" : "0 L";

  return (
    <motion.section
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated water drops background */}
      <div className={styles.waterBg}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={styles.waterDrop}
            style={{
              left: `${5 + Math.random() * 90}%`,
              "--delay": `${Math.random() * 5}s`,
              "--dur": `${3 + Math.random() * 4}s`,
              "--size": `${4 + Math.random() * 8}px`,
            }}
          />
        ))}
      </div>

      <div className={styles.container}>
        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <motion.span
              className={styles.logo}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              💧
            </motion.span>
            <div>
              <h1 className={styles.dashTitle}>JalSetu</h1>
              <p className={styles.greeting}>{greet}</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <motion.button className={styles.iconBtn} onClick={onScanSoil} whileTap={{ scale: 0.9 }} title="Scan Soil">📷</motion.button>
            <motion.button className={styles.iconBtn} onClick={onLogout} whileTap={{ scale: 0.9 }} title="Logout">🚪</motion.button>
          </div>
        </header>

        {/* ── Location badge ── */}
        <motion.div
          className={styles.locationBadge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span>📍</span>
          <span className={styles.locationText}>{location}</span>
        </motion.div>

        {/* ═══ TOP ROW: Soil + Weather + Crop ═══ */}
        <div className={styles.topRow}>
          {/* Soil Status Card */}
          <motion.div
            className={`${styles.topCard} ${styles.soilCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className={styles.topCardHeader}>
              <span className={styles.topCardIcon}>
                {soilData ? (moisture > 60 ? "💧" : moisture > 30 ? "🌱" : "🏜️") : "🏜️"}
              </span>
              <div className={`${styles.statusDot} ${styles[`dot_${soilData ? (moisture > 60 ? "green" : moisture > 30 ? "yellow" : "red") : "red"}`]}`} />
            </div>
            <h3 className={styles.topCardTitle}>{t.soilLabel}</h3>
            <p className={`${styles.topCardValue} ${styles[`tv_${soilData ? (moisture > 60 ? "green" : moisture > 30 ? "yellow" : "red") : "red"}`]}`}>
              {soilData ? (moisture > 60 ? t.soilWet : moisture > 30 ? t.soilMoist : t.soilDry) : t.soilDry}
            </p>
            {soilData && (
              <p className={styles.topCardSub}>{t.moisture}: {moisture}%</p>
            )}
            {!soilData && (
              <motion.button
                className={styles.scanMini}
                onClick={onScanSoil}
                whileTap={{ scale: 0.95 }}
              >
                📷 Scan
              </motion.button>
            )}
          </motion.div>

          {/* Weather Card */}
          <motion.div
            className={`${styles.topCard} ${styles.weatherCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className={styles.topCardHeader}>
              <span className={styles.topCardIcon}>{w ? condIcons[w.condition] : "🌤️"}</span>
              <div className={`${styles.statusDot} ${styles[`dot_${w?.rainChance > 50 ? "blue" : "yellow"}`]}`} />
            </div>
            <h3 className={styles.topCardTitle}>{t.weatherLabel}</h3>
            {w ? (
              <>
                <p className={styles.topCardValue}>{w.temp}°C</p>
                <p className={styles.topCardSub}>{condLabel(w.condition, t)}</p>
              </>
            ) : (
              <p className={styles.topCardValue}>--</p>
            )}
          </motion.div>

          {/* Crop Card */}
          <motion.div
            className={`${styles.topCard} ${styles.cropCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            onClick={() => { setTempCrop(selectedCrop); setCropModal(true); }}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.topCardHeader}>
              <span className={styles.topCardIcon}>{crop?.emoji || "🌾"}</span>
              <div className={`${styles.statusDot} ${styles.dot_green}`} />
            </div>
            <h3 className={styles.topCardTitle}>{t.cropLabel}</h3>
            <p className={styles.topCardValue}>{crop?.name[lang] || t.selectCrop}</p>
            {!crop && <p className={styles.topCardSub}>Tap to select</p>}
          </motion.div>
        </div>

        {/* ═══ DECISION BOX ═══ */}
        <motion.div
          className={`${styles.decisionCard} ${styles[`dec_${decColor}`]}`}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          {/* Decorative rings */}
          <div className={styles.decRings}>
            <div className={styles.decRing1} />
            <div className={styles.decRing2} />
          </div>

          <div className={styles.decContent}>
            <div className={styles.decLeft}>
              <motion.div
                className={styles.decBadge}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255,255,255,0.3)",
                    "0 0 0 16px rgba(255,255,255,0)",
                    "0 0 0 0 rgba(255,255,255,0.3)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                <span>{decEmoji}</span>
              </motion.div>
              <h2 className={styles.decTitle}>{decTitle}</h2>
              <p className={styles.decReason}>{decReason}</p>
            </div>
            <div className={styles.decRight}>
              <ConfidenceRing value={confidence} color={decColor} />
              <span className={styles.confLabel}>{t.confidence}</span>
            </div>
          </div>
        </motion.div>

        {/* ═══ WEATHER DETAILS (Expanded) ═══ */}
        {w && (
          <motion.div
            className={styles.weatherExpanded}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className={styles.sectionTitle}>{t.weatherTitle}</h3>
            <div className={styles.weatherGrid}>
              {[
                { icon: "🌡️", value: `${w.temp}°C`, label: t.wTemp, cls: "wTemp" },
                { icon: "💧", value: `${w.humidity}%`, label: t.wHumidity, cls: "wHumid" },
                { icon: "🌧️", value: `${w.rainChance}%`, label: t.wRain, cls: "wRain" },
                { icon: "💨", value: `${w.wind} km/h`, label: t.wWind, cls: "wWind" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`${styles.wCard} ${styles[item.cls]}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65 + i * 0.05 }}
                >
                  <span className={styles.wIcon}>{item.icon}</span>
                  <span className={styles.wValue}>{item.value}</span>
                  <span className={styles.wLabel}>{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ BOTTOM ROW: Insights + Metrics ═══ */}
        <div className={styles.bottomRow}>
          {/* Insights */}
          <motion.div
            className={styles.insightsSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className={styles.sectionTitle}>{t.insightsTitle}</h3>
            {insights.map((ins, i) => (
              <motion.div
                key={i}
                className={styles.insightItem}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + i * 0.1 }}
              >
                <span className={styles.insightIcon}>{ins.icon}</span>
                <p>{ins.text}</p>
                <span className={`${styles.insightDot} ${styles[`dot_${ins.dot}`]}`} />
              </motion.div>
            ))}
          </motion.div>

          {/* Metrics */}
          <motion.div
            className={styles.metricsSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className={styles.sectionTitle}>📊 Metrics</h3>
            <div className={styles.metricsGrid}>
              {[
                { icon: "🎯", value: `${confidence}%`, label: t.confidence, color: "green" },
                { icon: "💧", value: waterSaved, label: t.waterSaved, color: "blue" },
                { icon: "📊", value: "92%", label: t.efficiency, color: "teal" },
                { icon: "🔄", value: "14", label: t.irrigations, color: "purple" },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  className={styles.metricCard}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85 + i * 0.05 }}
                >
                  <span className={styles.metricIcon}>{m.icon}</span>
                  <span className={styles.metricValue}>{m.value}</span>
                  <span className={styles.metricLabel}>{m.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ Soil Scan Result (if available) ═══ */}
        {soilData && (
          <motion.div
            className={styles.soilResult}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className={styles.sectionTitle}>🔬 {t.soilLabel} Analysis</h3>
            <div className={styles.soilResultCard}>
              {soilData.imageUrl && (
                <img src={soilData.imageUrl} alt="Soil" className={styles.soilThumb} />
              )}
              <div className={styles.soilInfo}>
                <p className={styles.soilStatus}>
                  {moisture > 60 ? t.soilWet : moisture > 30 ? t.soilMoist : t.soilDry}
                </p>
                <p className={styles.soilMoisture}>{t.moisture}: {moisture}%</p>
                {soilData.color && <p className={styles.soilColor}>🎨 {soilData.color}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ Quick Actions ═══ */}
        <motion.div
          className={styles.actionsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
        >
          <div className={styles.actionRow}>
            <motion.button
              className={styles.actionPrimary}
              onClick={onScanSoil}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              📷 {t.scanCta}
            </motion.button>
            <motion.button
              className={styles.actionSecondary}
              onClick={() => { setTempCrop(selectedCrop); setCropModal(true); }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              🌱 {t.changeCrop}
            </motion.button>
          </div>
        </motion.div>

        <footer className={styles.footer}>
          <p>{t.footerText}</p>
        </footer>
      </div>

      {/* ═══ Crop Modal ═══ */}
      <AnimatePresence>
        {cropModal && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCropModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHandle} />
              <div className={styles.modalHeader}>
                <h2>{t.cropModalTitle}</h2>
                <button className={styles.modalClose} onClick={() => setCropModal(false)}>×</button>
              </div>
              <p className={styles.modalDesc}>{t.cropModalDesc}</p>

              {recommendedCrops.length > 0 && (
                <div className={styles.recBanner}>
                  <span>⭐</span> {t.recommended}
                </div>
              )}

              <div className={styles.cropGrid}>
                {cropDatabase.map((c) => (
                  <motion.div
                    key={c.id}
                    className={`${styles.cropItem} ${tempCrop === c.id ? styles.cropSelected : ""} ${recommendedCrops.includes(c.id) ? styles.cropRec : ""}`}
                    onClick={() => setTempCrop(c.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={styles.cropEmoji}>{c.emoji}</span>
                    <span className={styles.cropName}>{c.name[lang]}</span>
                    <span className={styles.cropWater}>
                      {c.waterNeed === "high" ? "💧💧💧" : c.waterNeed === "medium" ? "💧💧" : "💧"}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className={styles.confirmBtn}
                disabled={!tempCrop}
                onClick={() => { setSelectedCrop(tempCrop); setCropModal(false); }}
                whileTap={{ scale: 0.97 }}
              >
                {t.confirmCrop}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
