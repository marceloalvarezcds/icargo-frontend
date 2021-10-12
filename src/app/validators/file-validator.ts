import { ValidatorFn, AbstractControl } from '@angular/forms';

export class FileValidator {
  static fileMaxSize(maxSize: number): ValidatorFn {
    const validatorFn = (file: File): null | any => {
      if (file instanceof File && file.size > maxSize) {
        return {
          fileMinSize: { requiredSize: maxSize, actualSize: file.size, file },
        };
      }
    };
    return FileValidator.fileValidation(validatorFn);
  }

  static fileMinSize(minSize: number): ValidatorFn {
    const validatorFn = (file: File): null | any => {
      if (file instanceof File && file.size < minSize) {
        return {
          fileMinSize: { requiredSize: minSize, actualSize: file.size, file },
        };
      }
    };
    return FileValidator.fileValidation(validatorFn);
  }

  /**
   * extensions must not contain dot
   */
  static fileExtensions(allowedExtensions: Array<string>): ValidatorFn {
    const validatorFn = (file: File): null | any => {
      const fileFullName = file.name;
      if (allowedExtensions.length === 0) {
        return null;
      }

      if (fileFullName) {
        const ext = FileValidator.getExtension(fileFullName);
        if (!ext || allowedExtensions.indexOf(ext.toLowerCase()) === -1) {
          return {
            fileExtension: {
              allowedExtensions,
              actualExtension: ext,
              fileFullName,
            },
          };
        }
      }
    };
    return FileValidator.fileValidation(validatorFn);
  }

  private static getExtension(filename: string | null): null | string {
    if (filename?.indexOf('.') === -1) {
      return null;
    }
    return filename?.split('.').pop() ?? null;
  }

  private static fileValidation(
    validatorFn: (File: File) => null | any
  ): ValidatorFn {
    return (formControl: AbstractControl) => {
      if (!formControl.value) {
        return null;
      }

      const files: File[] = [];
      const isMultiple = Array.isArray(formControl.value);
      isMultiple
        ? formControl.value.forEach((file: File) => files.push(file))
        : files.push(formControl.value);

      for (const file of files) {
        return validatorFn(file);
      }

      return null;
    };
  }
}
