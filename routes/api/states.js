const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');

router.route('/')
    .get(statesController.getAllStates);

    router.route('/:state')
        .get(verifyStates, statesController.getState);


router.route('/:state/capital')
    .get(verifyStates, statesController.getStateCapital);
   
router.route('/:state/capital')
    .get(verifyStates, statesController.getStateCapital);

router.route('/:state/nickname')
    .get(verifyStates, statesController.getStateNickname);

router.route('/:state/population')
    .get(verifyStates, statesController.getStatePopulation);

router.route('/:state/admission')
    .get(verifyStates, statesController.getStateAdmission);

router.route('/:state/funfact')
    .get(verifyStates, statesController.getStateFunFact)
    .post(verifyStates, statesController.createStateFunFact)
    .patch(verifyStates, statesController.updateStateFunFact)
    .delete(verifyStates, statesController.deleteStateFunFact);

module.exports = router;