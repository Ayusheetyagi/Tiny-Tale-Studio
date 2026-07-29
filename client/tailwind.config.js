/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        body: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        paper: {
          DEFAULT: "#fdf8f0",
          soft: "#f7f0e4",
          deep: "#efe4d0",
        },
        amber: {
          soft: "#f3d9a6",
          DEFAULT: "#e8b45f",
          deep: "#c98a3a",
        },
        sage: {
          soft: "#dbe6d4",
          DEFAULT: "#9fb894",
          deep: "#6f8a63",
        },
        terracotta: {
          soft: "#f1c8b3",
          DEFAULT: "#d98763",
          deep: "#b1603f",
        },
        ink: {
          DEFAULT: "#3a3128",
          soft: "#665a4d",
          faint: "#a89a87",
        },
      },
      backgroundImage: {
        "paper-texture":
          "radial-gradient(circle at 20% 20%, rgba(233, 196, 149, 0.12) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(159, 184, 148, 0.1) 0%, transparent 45%)",
      },
      boxShadow: {
        book: "0 30px 60px -20px rgba(58, 49, 40, 0.25), 0 10px 30px -15px rgba(58, 49, 40, 0.15)",
        card: "0 8px 24px -12px rgba(58, 49, 40, 0.18)",
      },
      borderRadius: {
        book: "1.75rem",
      },
    },
  },
  plugins: [],
};
