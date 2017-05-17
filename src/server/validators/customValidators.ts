import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import * as moment from "moment";

export function IsLaterThan(property: string, validationOptions?: ValidationOptions) {

  return function (object: Object, propertyName: string) {
    let options: ValidationOptions = Object.assign(<ValidationOptions>{
      message: `${propertyName} must be a date later than ${property}`
    }, validationOptions);
    registerDecorator({
      name: "isLaterThan",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (value instanceof Date) &&
            (relatedValue instanceof Date) &&
            (value.getTime() > relatedValue.getTime()); // you can return a Promise<boolean> here as well, if you want to make async validation
        }
      }
    });
  };
}

/**
 * Checks if a value is a date.
 */
export function IsValidDateObj(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    let options: ValidationOptions = Object.assign(<ValidationOptions>{
      message: `${propertyName} must be a valid date`
    }, validationOptions);
    registerDecorator({
      name: "isValidDateObj",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let date = moment(value);
          return date.isValid();
        }
      }
    });
  };
}
