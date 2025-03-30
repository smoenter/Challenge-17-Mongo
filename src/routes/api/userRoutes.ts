import { Router } from 'express';
const router = Router();


import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createFriend,
  deleteFriend
} from '../../controllers/userController.js';

// /api/user
router.route('/').get(getAllUsers).post(createUser);

// /api/user/:userId
router
  .route('/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

  // /api/user/:userId/friends/:friendId
// POST to add a friend
router.post('/:userId/friends/:friendId', createFriend);

// DELETE to remove a friend
router.delete('/:userId/friends/:friendId', deleteFriend);

export { router as userRouter };
