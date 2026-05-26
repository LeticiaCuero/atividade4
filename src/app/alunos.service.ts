import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aluno, Disciplina } from './aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunosService {
  private readonly apiUrl = 'https://two0261-frontend.onrender.com/alunos';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl);
  }

  buscarPorRa(ra: string): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/${encodeURIComponent(ra)}`);
  }

  listarDisciplinas(ra: string): Observable<Disciplina[]> {
    return this.http.get<Disciplina[]>(`${this.apiUrl}/${encodeURIComponent(ra)}/disciplinas`);
  }

  atualizar(ra: string, aluno: Omit<Aluno, 'ra'>): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/${encodeURIComponent(ra)}`, aluno);
  }
}
