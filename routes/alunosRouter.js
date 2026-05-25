const express = require('express');
const alunosController = require('../controllers/alunosController');

const router = express.Router();

router.get('/', alunosController.obterTodos);
router.get('/:ra/disciplinas', alunosController.obterDisciplinas);
router.get('/:ra', alunosController.obterPorRa);
router.put('/:ra', alunosController.atualizar);

module.exports = router;