// toast.ts

import { useToast } from "vue-toast-notification";

const docUrl =
  "https://nest-desktop.readthedocs.io/en/latest/troubleshootings/index.html#error-messages";

interface IOptionProps {
  type?: "success" | "info" | "warning" | "error" | "default" | string;
  onClick?: () => void;
  duration?: number;
}

/**
 * Open toast to show message.
 */
export function openToast(
  message: string,
  optionProps: IOptionProps = { type: "success" }
) {
  const $toast = useToast();

  // Add click event handler to redirect user to the documentation.
  switch (optionProps.type) {
    case "error": {
      message += " -- Click here for details ...";
      optionProps.onClick = () => window.open(docUrl, "_blank");
      optionProps.duration = 5000;
      $toast.error(message, optionProps);
      break;
    }
    default: {
      $toast.open({ message, ...optionProps });
      break;
    }
  }
}

export function openError(message: string) {
  openToast(message, { type: "error" });
}
