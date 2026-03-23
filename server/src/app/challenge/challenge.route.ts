import express from 'express';
import { ChallengeService } from './challenge.service';
import { authorize } from '@/middlewares';
const router = express.Router();

router.post('/', authorize('SUPER_ADMIN'), ChallengeService.createChallenge);
router.patch('/reorder', authorize('SUPER_ADMIN'), ChallengeService.reorderChallenges);
router.patch('/change-index/:id', authorize('SUPER_ADMIN'), ChallengeService.changeIndexOfChallenge);
router.patch('/:id', authorize('SUPER_ADMIN'), ChallengeService.updateChallenge);
router.delete('/:id', authorize('SUPER_ADMIN'), ChallengeService.deleteChallenge);
router.get('/', ChallengeService.getAllChallenge);
router.get('/:id', ChallengeService.getSingleChallenge);

export const ChallengeRoutes = router;
