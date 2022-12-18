import { PessoasService } from './../../pessoas.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Pessoa } from 'src/app/Pessoa';
import { InfoGit } from 'src/app/InfoGit';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css'],
})
export class PessoasComponent implements OnInit {
  formulario: any;
  tituloFormulario: string;
  pessoas: Pessoa[];
  infoGit: InfoGit[];
  nomePessoa: string;

  pessoaId: number;

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false;
  visibilidadeFormularioAtualiza: boolean = false;
  controlBtn: number = 0;

  modalRef: BsModalRef;

  constructor(
    private pessoasService: PessoasService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.pessoasService.PegarTodos().subscribe((resultado) => {
      this.pessoas = resultado;
    });
    this.pessoasService.infoGit().subscribe((resultado) => {
      this.infoGit = resultado;
    });
  }

  RedirectLInk(link) {
    window.location.href = link;
  }

  ExibirFormularioCadastro(): void {
    this.controlBtn = 0;
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.tituloFormulario = 'Nova Pessoa';

    this.formulario = new FormGroup({
      nome: new FormControl(null),
      sobrenome: new FormControl(null),
      nascimento: new FormControl(null),
      idade: new FormControl(0),
      cpf: new FormControl(null),
      profissao: new FormControl(null),
    });
  }

  ExibirFormulario(pessoaId): void {
    this.controlBtn = 1;
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;

    this.pessoasService.PegarPeloId(pessoaId).subscribe((resultado) => {
      const nascimento = new Date(resultado.nascimento);
      const nascimentoTra = new Intl.DateTimeFormat('pt-BR').format(nascimento);
      this.tituloFormulario = `Atualizar o registro: ${resultado.nome} - ${nascimentoTra}`;
      const hoje = new Date();
      const idade = Math.floor(
        Math.ceil(
          Math.abs(nascimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24)
        ) / 365.25
      );

      this.formulario = new FormGroup({
        pessoaId: new FormControl(resultado.pessoaId),
        nome: new FormControl(resultado.nome),
        sobrenome: new FormControl(resultado.sobrenome),
        nascimento: new FormControl(resultado.nascimento),
        idade: new FormControl(idade),
        cpf: new FormControl(resultado.cpf),
        profissao: new FormControl(resultado.profissao),
      });
    });
  }

  EnviarFormulario(conteudoModal?: TemplateRef<any>): void {
    const pessoa: Pessoa = this.formulario.value;

    if (pessoa.pessoaId > 0) {
      this.pessoasService.AtualizarPessoa(pessoa).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        // alert('Pessoa atualizada com sucesso');
        this.modalRef = this.modalService.show(conteudoModal);
        this.nomePessoa = pessoa.nome;
        this.pessoasService.PegarTodos().subscribe((registros) => {
          this.pessoas = registros;
        });
      });
    } else {
      this.pessoasService.SalvarPessoa(pessoa).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        // alert('Pessoa inserida com sucesso');
        this.modalRef = this.modalService.show(conteudoModal);
        this.nomePessoa = pessoa.nome;
        this.pessoasService.PegarTodos().subscribe((registros) => {
          this.pessoas = registros;
        });
      });
    }
  }

  Voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = false;
    this.visibilidadeFormularioAtualiza = false;
  }
  CalcularIdade(nascimento): void {
    const hoje = new Date();
    const calculaIdade = Math.floor(
      Math.ceil(
        Math.abs(nascimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24)
      ) / 365.25
    );
    this.formulario = new FormGroup({
      idade: new FormControl(calculaIdade),
    });
  }

  ExibirConfirmacaoExclusao(
    pessoaId,
    nomePessoa,
    conteudoModal: TemplateRef<any>
  ): void {
    this.modalRef = this.modalService.show(conteudoModal);
    this.pessoaId = pessoaId;
    this.nomePessoa = nomePessoa;
  }

  ExcluirPessoa(pessoaId, conteudoModal?: TemplateRef<any>) {
    this.pessoasService.ExcluirPessoa(pessoaId).subscribe((resultado) => {
      this.modalRef.hide();
      // alert('Pessoa excluída com sucesso');
      this.modalRef = this.modalService.show(conteudoModal);
      this.pessoasService.PegarTodos().subscribe((registros) => {
        this.pessoas = registros;
      });
    });
  }
}
