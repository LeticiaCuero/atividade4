const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosController');

router.get('/', alunosController.obterTodos);
router.get('/:ra/disciplinas', alunosController.obterDisciplinas);
router.get('/:ra', alunosController.obterPorRa);
router.put('/:ra', alunosController.atualizar);

module.exports = router;
