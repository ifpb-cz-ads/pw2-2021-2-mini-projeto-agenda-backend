# pw2-2021-2-mini-projeto-agenda-backend

Este é o repositório que compreende a Application Programming Interface (API) da aplicação do mini projeto 2 da disciplina de Programação para Web II. Para persistência dos dados foi utilizado o banco de dados PostgresSQL e para enviar o email de confirmação de novo usuário utizamos a plataforma SendGrid.

# Iniciando

É necessário baixar as dependências para que o projeto possa ser executado, para isso execute um desses comandos para usar o npm `npm install or npm i` , se você prefere o utilizar o yarn, execute algum dos seguintes comandos `yarn install or yarn`. Depois disso, o gerenciador de pacotes escolhido irá baixar todas as dependências usadas no projeto.

# Variáveis de Ambiente

Para conectar o back-end ao banco de dados e difinir a porta da rota é necessário definir os valores das variáveis citadas abaixo para que as configurações necessárias sejam atendidas.

```
DB_NAME= Nome do banco postgres
DB_USER= Nome do usuário postgres
DB_PASSWORD= Senha do cliente postgres
DB_HOST= Host da aplicação
EMAIL_SENDER= Remetente do qual será encaminhado o email de confirmação de cadastro
DB_PORT= Porta da aplicação
HOST_URL= URL do frontend
SENDGRID_API_KEY= Api key do sendgrid
TOKEN_SECRET= Token secreto usado para fazer a validação do jwt
```

# Rodando o Projeto

Agora que as configurações já foram estabelecidas é o momento de colocar a aplicação para funcionar, para isso, execute `npm start` ou `yarn start`.
