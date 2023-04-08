create database tce;
use tce;

create table Usuario(
id_usu int primary key auto_increment,
nome_usu varchar(300) not null,
email_usu  varchar(300) unique not null,
senha_usu varchar(500) not null
);

create table Pessoa(
id_pes int primary key auto_increment,
nome_pes varchar(300) not null,
cpf_pes varchar(300) unique not null,
email_pes varchar(300) unique not null,
dataNascimento_pes date not null,
telefone_pes varchar(300) not null,
nomePai_pes varchar(300) not null,
nomeMae_pes varchar(300) not null,
responsavel_pes varchar(500),
cep_pes varchar(300) not null,
estado_pes varchar(300) not null,
cidade_pes varchar(300) not null,
bairro_pes varchar(300) not null,
logradouro_pes varchar(300) not null,
numero_pes varchar(300) not null,
id_usu_fk int not null,
foreign key (id_usu_fk) references Usuario (id_usu)
);

