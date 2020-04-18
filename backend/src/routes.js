import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import MembershipsController from './app/controllers/MembershipsController';
import CheckinController from './app/controllers/CheckinController';

import authMiddleware from './app/middlewares/auth';

const router = new Router();

router.post('/sessions', SessionController.store);

router.use(authMiddleware);

router.get('/students/:studentId/checkins', CheckinController.index);
router.post('/students/:studentId/checkins', CheckinController.store);

router.get('/students', StudentController.index);
router.get('/students/:id', StudentController.show);
router.post('/students', StudentController.store);
router.put('/students/:id', StudentController.update);

router.get('/plans', PlanController.index);
router.get('/plans/:id', PlanController.show);
router.post('/plans', PlanController.store);
router.put('/plans/:id', PlanController.update);
router.delete('/plans/:id', PlanController.delete);

router.post('/memberships', MembershipsController.store);
router.put('/memberships/:id', MembershipsController.update);
router.delete('/memberships/:id', MembershipsController.delete);
router.get('/memberships', MembershipsController.index);

export default router;
