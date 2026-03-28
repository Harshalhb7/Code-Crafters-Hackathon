"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "@/components/IntroScreen";
import LanguageScreen from "@/components/LanguageScreen";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/Dashboard";
import ScannerScreen from "@/components/ScannerScreen";

export default function Home() {
  const [screen, setScreen] = useState("intro");
  const [lang, setLang] = useState("en");
  const [soilData, setSoilData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const handleLanguage = useCallback((l) => {
    setLang(l);
    setScreen("login");
  }, []);

  const handleLogin = useCallback(() => {
    setScreen("dashboard");
  }, []);

  const handleScanComplete = useCallback((data) => {
    setSoilData(data);
    setScreen("dashboard");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {screen === "intro" && (
        <IntroScreen key="intro" onNext={() => setScreen("language")} />
      )}
      {screen === "language" && (
        <LanguageScreen key="language" onSelect={handleLanguage} lang={lang} />
      )}
      {screen === "login" && (
        <LoginScreen key="login" onLogin={handleLogin} lang={lang} />
      )}
      {screen === "dashboard" && (
        <Dashboard
          key="dashboard"
          lang={lang}
          soilData={soilData}
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          weatherData={weatherData}
          setWeatherData={setWeatherData}
          onScanSoil={() => setScreen("scanner")}
          onLogout={() => setScreen("language")}
        />
      )}
      {screen === "scanner" && (
        <ScannerScreen
          key="scanner"
          lang={lang}
          onBack={() => setScreen("dashboard")}
          onComplete={handleScanComplete}
        />
      )}
    </AnimatePresence>
  );
}
