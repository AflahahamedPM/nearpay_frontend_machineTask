import React from "react";
import { useSnackbar } from "notistack";

const useAlert = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const publishNotification = (
    message = "",
    variant,
    duration = 3000,
    anchorOrigin = {}
  ) => {
    return enqueueSnackbar(message, {
      variant,
      autoHideDuration: duration,
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
        ...anchorOrigin,
      },
    }); // always return id
  };

  return { publishNotification, closeSnackbar };
};

export default useAlert;
