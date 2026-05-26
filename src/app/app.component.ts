import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Aluno, Disciplina } from './aluno.model';
import { AlunosService } from './alunos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  alunos: Aluno[] = [];
  alunoSelecionado: Aluno | null = null;
  disciplinas: Disciplina[] = [];
  alunoEditado: Aluno | null = null;
  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' | '' = '';
  carregando = false;

  constructor(private readonly alunosService: AlunosService) {}

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.carregando = true;
    this.limparMensagem();

    this.alunosService.listar().subscribe({
      next: (alunos) => {
        this.alunos = alunos;
        this.carregando = false;

        if (alunos.length > 0) {
          this.selecionarAluno(alunos[0].ra);
        }
      },
      error: () => {
        this.carregando = false;
        this.mostrarMensagem('erro', 'Erro ao carregar alunos.');
      }
    });
  }

  selecionarAluno(ra: string, editar = false): void {
    this.limparMensagem();

    this.alunosService.buscarPorRa(ra).subscribe({
      next: (aluno) => {
        this.alunoSelecionado = aluno;
        this.alunoEditado = this.clonarAluno(aluno);
      },
      error: () => this.mostrarMensagem('erro', 'Erro ao buscar aluno.')
    });

    this.alunosService.listarDisciplinas(ra).subscribe({
      next: (disciplinas) => {
        this.disciplinas = disciplinas;

        if (editar) {
          document.getElementById('edicao')?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      error: () => this.mostrarMensagem('erro', 'Erro ao buscar disciplinas.')
    });
  }

  adicionarDisciplina(): void {
    this.alunoEditado?.disciplinas.push({
      codigo: '',
      nome: '',
      professor: ''
    });
  }

  removerDisciplina(index: number): void {
    this.alunoEditado?.disciplinas.splice(index, 1);
  }

  salvarAluno(): void {
    if (!this.alunoEditado) {
      return;
    }

    const nome = this.alunoEditado.nome.trim();
    const disciplinas = this.alunoEditado.disciplinas.map((disciplina) => ({
      codigo: disciplina.codigo.trim(),
      nome: disciplina.nome.trim(),
      professor: disciplina.professor.trim()
    }));

    const temCampoVazio = !nome || disciplinas.some((disciplina) => (
      !disciplina.codigo || !disciplina.nome || !disciplina.professor
    ));

    if (temCampoVazio) {
      this.mostrarMensagem('erro', 'Preencha todos os campos.');
      return;
    }

    this.alunosService.atualizar(this.alunoEditado.ra, { nome, disciplinas }).subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', 'Aluno atualizado com sucesso.');
        this.carregarAlunos();
      },
      error: () => this.mostrarMensagem('erro', 'Erro ao atualizar aluno.')
    });
  }

  private clonarAluno(aluno: Aluno): Aluno {
    return {
      ra: aluno.ra,
      nome: aluno.nome,
      disciplinas: aluno.disciplinas.map((disciplina) => ({ ...disciplina }))
    };
  }

  private mostrarMensagem(tipo: 'sucesso' | 'erro', mensagem: string): void {
    this.tipoMensagem = tipo;
    this.mensagem = mensagem;
  }

  private limparMensagem(): void {
    this.tipoMensagem = '';
    this.mensagem = '';
  }
}
