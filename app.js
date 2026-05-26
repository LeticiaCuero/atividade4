const express = require('express');
const path = require('path');
const alunosRouter = require('./routes/alunosRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/alunos', alunosRouter);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta: ${PORT}`);
    });
}

module.exports = app;
