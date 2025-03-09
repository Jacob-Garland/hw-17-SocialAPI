import { Router } from 'express';
import thoughtController from '../controllers/thoughtController';

const router = Router();

// Thought routes
router.get('/', thoughtController.getThoughts);
router.get('/:thoughtId', thoughtController.getThoughtById);
router.post('/', thoughtController.createThought);
router.put('/:thoughtId', thoughtController.updateThought);
router.delete('/:thoughtId', thoughtController.deleteThought);

// Reaction routes
router.post('/:thoughtId/reactions', thoughtController.addReaction);
router.delete('/:thoughtId/reactions/:reactionId', thoughtController.removeReaction);

export default router;