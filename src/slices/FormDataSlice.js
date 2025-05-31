import { createSlice } from "@reduxjs/toolkit";

// const initialTheme = localStorage.getItem("formData")
//     ? JSON.parse(localStorage.getItem("formData"))
//     : null;

// const formdataSlice = createSlice({
//     name: "formData",
//     initialState: {
//         formData: initialTheme,
//     },
//     reducers: {
//         // updateField: (state, action) => {
//         //   const { field, value } = action.payload;
//         //   state[field] = value;
//         // },
//         updateField: (state, action) => {
//             const { field, value } = action.payload;
//             state.data.data[field] = value; // assuming your formData structure
//         },

//         setformData: (state, action) => {
//             state.formData = action.payload;
//             localStorage.setItem("formData", JSON.stringify(state.formData));
//         },
//     },
// });

// export const { setformData, updateField } = formdataSlice.actions;
// export default formdataSlice.reducer;


const initialTheme = localStorage.getItem("formData")
  ? JSON.parse(localStorage.getItem("formData"))
  : {
      data: {
        data: {
          title: "",
          description: "",
          // other default fields
        }
      }
    };

const formdataSlice = createSlice({
  name: "formData",
  initialState: {
    formData: initialTheme,
    
  },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;  // ensure path correct
      localStorage.setItem("formData", JSON.stringify(state.formData));  // persist here
    },
    setformData: (state, action) => {
      state.formData = action.payload;
      localStorage.setItem("formData", JSON.stringify(state.formData));
    },
  },
});

export const { setformData, updateField } = formdataSlice.actions;
export default formdataSlice.reducer;
