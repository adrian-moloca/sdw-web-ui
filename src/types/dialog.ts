export interface DialogProps {
  visible: boolean;
  title?: string;
  message?: string;
  description?: string;
  onClickOk: () => void;
  onClickCancel: () => void;
}
