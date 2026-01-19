export type ValidationLevel = 'error' | 'warning';

export interface ValidationMessage {
  level: ValidationLevel;
  location: string;
  message: string;
}

export interface ValidatorContext {
  rootDir: string;
}

export interface Validator {
  name: string;
  validate(context: ValidatorContext): Promise<ValidationMessage[]> | ValidationMessage[];
}
