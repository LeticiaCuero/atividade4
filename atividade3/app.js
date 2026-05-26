const express = require('express');
const alunosRouter = require('./routes/alunosRouter');


const app = express();
app.use(express.json());
app.use("/alunos", alunosRouter);

app.listen(3000, () => {
    console.log('Servidor rodando na porta: 3000')
    });