const express = require('express');
const auth = require('../middleware/auth');
const itemsController = require('../controllers/items');
const router = express.Router();

router.get('/', auth, itemsController.list);
router.post('/', auth, itemsController.create);
router.get('/:id', auth, itemsController.get);
router.put('/:id', auth, itemsController.update);
router.delete('/:id', auth, itemsController.remove);

module.exports = router;
