import { createDialog } from "vuetify3-dialog";

export const confirmDialog = (props: {
  text: string;
  title: string;
}): Promise<boolean> =>
  createDialog({
    buttons: [
      { title: "yes", key: "yes" },
      { title: "no", key: "no" },
    ],
    ...props,
  }).then((answer: string) => answer === "yes");
