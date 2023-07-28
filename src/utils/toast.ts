// toast.ts

import { useToast } from "vue-toast-notification";

type types = "success" | "info" | "warning" | "error" | "default" | string;

interface optionsProps {
  type?: types;
  onClick?: any;
  duration?: number;
}

/**
 * Open toast to show message.
 */
export function openToast(
  message: string,
  options: optionsProps = { type: "success" }
) {
  const $toast = useToast();

  // Add click event handler to redirect user to the documentation.
  switch (options.type) {
    case "error": {
      message += " -- Click here for details ...";
      options.onClick = () =>
        window.open(
          "https://nest-desktop.readthedocs.io/en/latest/troubleshootings/index.html#error-messages",
          "_blank"
        );
      options.duration = 5000;

      $toast.error( message, options );
      break;
    }
    default: {
      $toast.open({ message, ...options });
      break;
    }
  }
}
