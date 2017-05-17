import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { UserController } from '../controllers/userController';


/**
 * Checks if a value is existing in the system.
 */
export function IsValidTeacherIds(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    let options: ValidationOptions = Object.assign(<ValidationOptions>{
      message: "The value '$value' does not exist in the system"
    }, validationOptions);
    //console.log("options", options);
    registerDecorator({
      name: "isValidTeacherIds",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: options,
      validator: IsValidTeacherIdsConstraint
    });
  };
}


@ValidatorConstraint({ async: true })
class IsValidTeacherIdsConstraint implements ValidatorConstraintInterface {

  validate(teacherIds: any, args: ValidationArguments) {
    const ctrl = new UserController();
    return ctrl.checkIdsExist(null, teacherIds, ['teacher'])
      .then((value) => {
        return value;
      })
      .catch(err => {
        return false;
      });
  }

}