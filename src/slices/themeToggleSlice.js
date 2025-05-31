import { createSlice } from "@reduxjs/toolkit";

const initialTheme = localStorage.getItem("theme") || "light";

const themeToggleSlice = createSlice({
  name: "themeToggle",
  initialState: {
    theme: initialTheme,
  },
  reducers: {
    setThemeToggle: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme); // persist to localStorage
    },
  },
});

export const { setThemeToggle } = themeToggleSlice.actions;
export default themeToggleSlice.reducer;
