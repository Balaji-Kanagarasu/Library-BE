import { Request } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IApiResponse, ILibraryTransaction } from "../common/interface";
import { errorResponseMap } from "../helpers/helper";
import LibraryTransactionModel from "../models/libraryTransactionModel";

/**
 * Service for creating new book
 * @returns {IApiResponse}
 */
export const createTransactionService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.TRANSACTION.ERROR_CREATING_TRANSACTION,
    data: null,
  };
  try {
    const { bookId, userId, dueDate, transactionType } =
      req.body as ILibraryTransaction;
    const existingTransaction = await LibraryTransactionModel.findOne({
      bookId,
      userId,
      dueDate,
      ...(transactionType && { transactionType }),
    });
    if (existingTransaction) {
      response.statusCode = 409;
      response.message =
        CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_ALREADY_EXISTS;
      return response;
    }
    const newTransaction = new LibraryTransactionModel({
      bookId,
      userId,
      dueDate,
      ...(transactionType && { transactionType }),
    });

    const savedTransaction = await newTransaction.save();

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message =
      CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_CREATED_SUCCESSFULLY;
    response.data = savedTransaction;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in createTransaction service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Service for get transactions
 * @returns {IApiResponse}
 */
export const getTransactionsService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.TRANSACTION.ERROR_IN_GETTING_TRANSACTIONS,
    data: null,
  };
  try {
    const { transactionType, id, bookId, userId, dueDate } = req.body;
    let transactionData;
    if (id) {
      transactionData = await LibraryTransactionModel.findById(id);
    } else {
      const queryObj = {
        ...(transactionType && { transactionType }),
        ...(bookId && { bookId }),
        ...(userId && { userId }),
        ...(dueDate && { dueDate }),
      };

      transactionData = await LibraryTransactionModel.find(queryObj);
      if (!transactionData.length) {
        transactionData = null;
      }
    }

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = transactionData
      ? CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_FOUND
      : CONSTANT_MESSAGE.TRANSACTION.NO_TRANSACTION_FOUND;
    response.data = transactionData;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in getTransactionsService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to update the transaction details.
 * @returns
 */
export const updateTransactionService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.TRANSACTION.ERROR_IN_UPDATING_TRANSACTION,
    data: null,
  };
  try {
    const { bookId, userId, dueDate, transactionType, id } =
      req.body as ILibraryTransaction;

    const transactionData = await LibraryTransactionModel.findOneAndUpdate(
      { _id: id },
      {
        ...(bookId && { bookId }),
        ...(userId && { userId }),
        ...(dueDate && { dueDate }),
        ...(transactionType && { transactionType }),
      },
      { returnDocument: "after" }
    );
    if (transactionData) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message =
        CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_UPDATED_SUCCESSFULLY;
      response.data = transactionData;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.TRANSACTION.NO_TRANSACTION_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateTransactionService service ${
        error?.message ?? ""
      }`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to delete the Transaction by Id.
 */
export const deleteTransactionService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.USER.ERROR_IN_DELETING_USER,
    data: null,
  };
  try {
    const { id } = req.query;
    const deletedResponse = await LibraryTransactionModel.findByIdAndDelete(id);
    if (deletedResponse) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message =
        CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_SUCCESSFULLY_DELETED;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.TRANSACTION.NO_TRANSACTION_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateTransactionService service ${
        error?.message ?? ""
      }`
    );
    errorResponseMap(error, response);
  }
  return response;
};
