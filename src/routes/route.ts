import Router from "express-promise-router";
import {
  addBookController,
  deleteBookController,
  getBookController,
  updateBookController,
} from "../controllers/bookController";
import {
  addUserController,
  deleteUserController,
  getUserController,
  updateUserController,
} from "../controllers/userController";
import {
  addTransactionController,
  getTransactionController,
  updateTransactionController,
  deleteTransactionController,
} from "../controllers/transactionController";

const router = Router();

/**
 * User api routes.
 */
router.post("/addUser", addUserController);
router.get("/users", getUserController);
router.post("/updateUser", updateUserController);
router.delete("/deleteUser", deleteUserController);

/**
 * Book api routes.
 */
router.post("/addBook", addBookController);
router.get("/books", getBookController);
router.post("/updateBook", updateBookController);
router.delete("/deleteBook", deleteBookController);

/**
 * transaction api routes.
 */
router.post("/addTransaction", addTransactionController);
router.post("/transactions", getTransactionController);
router.post("/updateTransaction", updateTransactionController);
router.delete("/deleteTransaction", deleteTransactionController);

export default router;
