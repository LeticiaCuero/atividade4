const express = require('express');
const alunosRouter = require('./routes/alunosRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/alunos', alunosRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});