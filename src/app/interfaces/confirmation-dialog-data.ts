export interface ConfirmationDialogData {
  title?: string;
  message: string;
  closeButtonClass?: string;
  confirmedButtonClass?: string;
  closeButtonText?: string;
  confirmedButtonText?: string;
}

export const mockConfirmationDialogData: ConfirmationDialogData = {
  title: 'Confirmación',
  message: '¿Estás seguro?',
  closeButtonClass: 'close',
  confirmedButtonClass: 'confirm',
  closeButtonText: 'No',
  confirmedButtonText: 'Si',
};
