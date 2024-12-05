import { createDialog } from "vuetify3-dialog";

export const confirmDialog = (props: { text: string; title: string }): Promise<boolean> =>
  createDialog({
    buttons: [
      { title: "no", key: "no" },
      { title: "yes", key: "yes" },
    ],
    ...props,
  }).then((answer: string) => answer === "yes");
