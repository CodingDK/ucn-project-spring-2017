import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


const validSchoolNames: string[] = require("../../shared/data/schoolClasses.json").map((value: any) => { return value.name;});

/**
 * Checks if a value is existing in the system.
 */
export function IsValidSchoolClassNames(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    let options: ValidationOptions = Object.assign(<ValidationOptions>{
      message: "$property contains a value that does not exist"
    }, validationOptions);
    registerDecorator({
      name: "isValidSchoolClassNames",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: options,
      validator: IsValidSchoolClassNamesConstraint
    });
  };
}


@ValidatorConstraint({ async: false })
class IsValidSchoolClassNamesConstraint implements ValidatorConstraintInterface {
  validate(schoolClassNames: any, args: ValidationArguments) {
    return !schoolClassNames.some((v: any) => {
      //return true if the value is not valid and false for continue validating values
      return validSchoolNames.indexOf(v) == -1;
    });
  }
}