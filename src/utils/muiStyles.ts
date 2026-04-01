export const popupModalStyle = {
  "& .MuiPaper-root": {
    borderRadius: "1em",
    backgroundColor: "#E0E0E0",
    // color: "#E0E0E0",
  },
  "& .MuiTypography-root": {
    // color: "#E0E0E0",
  },
};

export const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#f6e9d9",
    "& fieldset": {
      borderColor: "#f6e9d9", 
    },
    "&:hover fieldset": {
      borderColor: "#f6e9d9", 
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f6e9d9", 
    },
    "&.Mui-disabled": {
      opacity: 1,
      color: "#bfae99", 
      "& fieldset": {
        borderColor: "#bfae99", 
      },
    },
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#bfae99 !important", 
    WebkitTextFillColor: "#bfae99 !important",
  },
  "& .MuiInputLabel-root": {
    color: "#f6e9d9", 
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#f6e9d9", 
  },
};

export const searchInputStyle = {
  "& .MuiInputBase-input": {
    width: "400px",
    color: "#DCD7C9",
  },
  "& .MuiFormLabel-root": {
    color: "#DCD7C9",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "#DCD7C9",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#DCD7C9",
  },
};
