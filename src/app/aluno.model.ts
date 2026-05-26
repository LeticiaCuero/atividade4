export interface Disciplina {
  codigo: string;
  nome: string;
  professor: string;
}

export interface Aluno {
  ra: string;
  nome: string;
  disciplinas: Disciplina[];
}
