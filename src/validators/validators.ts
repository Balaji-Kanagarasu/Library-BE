import Joi, { ObjectSchema } from "joi";
import { isValidObjectId } from "mongoose";
import { ILibraryTransaction } from "src/common/interface";

/**
 * Schema for crete user input validation.
 */
export const userValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  userName: Joi.string().min(3).max(30).required(),
  contactNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  emailId: Joi.string().email().required(),
});

/**
 * Schema for crete book input validation.
 */
export const bookValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  author: Joi.string().min(3).max(30).required(),
  currentStatus: Joi.string().optional(),
});

/**
 * Custom Joi ObjectId validation.
 */
const objectIdValidation = (value: string, helpers: any) => {
  if (!isValidObjectId(value)) {
    return helpers.error("any.invalid"); // Return error if value is not a valid ObjectId
  }
  return value; // Return the value if it is valid
};

/**
 * Schema for crete Transaction input validation.
 */
export const transactionValidation: ObjectSchema<ILibraryTransaction> =
  Joi.object({
    userId: Joi.string()
      .custom(objectIdValidation, "ObjectId validation")
      .required(),
    bookId: Joi.string()
      .custom(objectIdValidation, "ObjectId validation")
      .required(),
    dueDate: Joi.date().iso().required(),
    transactionType: Joi.string().optional(),
  });

/**
 * Schema for update Transaction input validation.
 */
export const updateTransactionValidation: ObjectSchema<ILibraryTransaction> =
  Joi.object({
    userId: Joi.string().custom(objectIdValidation, "ObjectId validation"),
    bookId: Joi.string().custom(objectIdValidation, "ObjectId validation"),
    dueDate: Joi.date().iso(),
    transactionType: Joi.string().valid("BORROWED", "RETURNED"),
    id: Joi.string().required(),
  });
