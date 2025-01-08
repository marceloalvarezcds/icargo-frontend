import {
  ConfirmationDialogData,
  mockConfirmationDialogData,
} from './confirmation-dialog-data';

export interface ComentarioConfirmDialogData extends ConfirmationDialogData {
  comentarioRequirido: boolean;
  htmlContent?:string;
  htmlFooter?:string;
}

export const mockComentarioConfirmDialogData: ComentarioConfirmDialogData = {
  ...mockConfirmationDialogData,
  comentarioRequirido: false,
};

export const mockRequiredComentarioConfirmDialogData: ComentarioConfirmDialogData =
  {
    ...mockConfirmationDialogData,
    comentarioRequirido: true,
  };
