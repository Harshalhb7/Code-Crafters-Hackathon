import "./globals.css";

export const metadata = {
  title: "JalSetu — Smart Irrigation System",
  description: "AI-powered smart irrigation system for Indian farmers. Real-time soil analysis, weather data, and crop recommendations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
