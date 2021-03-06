# Referências do ODATA
- listar - `/entity`, contém paginação padrão 10.
- filtrar por campo - `/entity?filter=id eq 1`,
- Filtro AND - `/entity?filter=id eq 1 and name eq 'jorge'` 
- Filtro OR - `/entity?filter=id eq 1 and name or 'jorge'` 
- Filtro Like `%string%` -  `/entity?filter=substringof('jorge', createdBy)` 
- Filtro Like `string%` -  `/entity?filter=startswith('jorge', createdBy)` 
- Múltiplos filtros - `/entity?filter=(createdBy eq 'jorge' or updatedBy eq 'mello') or (id eq 3) and (id eq 2)`
- Paginação - `/entity?size=20&page=4`
- Filtro case insensitivo `Like` - `/entity?filter=tolower(startswith('D', createdBy))`
- Filtro case insensitivo `OR AND` - `/entity?filter=tolower(createdBy eq 'Jorge')`

# Rodando a arquitetura localmente
### Pré requisitos
- Nodejs
- Serverless Framwork (`npm install -g serverless`)
- Postgres
- Sequelize CLI (`npm install -g sequelize-cli`)
- Conta na AWS

### Instalação
- Clonar o repositório.
- Acessar a pasta clonada e rodar um `npm i`.
- Adicionar uma base de dados no postgres 11 com nome de `point`.
- Acessar o diretório clonado `\config\config.json` e apontar o ambiente development ao seu postgres 11.
- No root do projeto clonado executar o comando `npx sequelize-cli db:migrate`, para migrar a base.
- No arquivo `serverless.yml` em `provider > environment` aponte sua accesKey, secretAccessKey da AWS endpoint e região do DynamoDB (os endpoints podem ser acessados aqui https://docs.aws.amazon.com/general/latest/gr/ddb.html) e o endpoint do sistema legado.

Para executar localmente é necessário criar uma tabela no DynamoDB chamanda `point` e chave `primária id: string.`

![alt text](https://github.com/jorgekg/point-record-serverless/blob/master/images/DynamoDB-create.PNG?raw=true)

Por fim rode o comando `npm start`

Vale lembrar que a API OData pode levar até 1 minuto para estar disponível, após a inserção dos dados!
`Para facilitar uma coleção do postman esta disponível aqui https://github.com/jorgekg/point-record-serverless/blob/master/point-record.postman_collection.json`

O ambiente local é apenas para teste da arquitetura, portanto para teste de performance é recomendado utilizar o ambiente cloud.

# Rodando a arquitetura na AWS
### Pré requisitos
- Nodejs
- Serverless Framwork (`npm install -g serverless`)
- Postgres
- Sequelize CLI (`npm install -g sequelize-cli`)
- Conta na AWS

### Instalação
- Clonar o repositório.
- Acessar a pasta clonada e rodar um `npm i`.
- Adicionar uma base de dados no postgres 11 com nome de `point`.
- Acessar o diretório clonado `\config\config.json` e apontar o ambiente development ao seu postgres 11.
- No root do projeto clonado executar o comando `npx sequelize-cli db:migrate`, para migrar a base.
- No arquivo `serverless.yml` em `provider > environment` aponte sua accesKey, secretAccessKey da AWS endpoint e região do DynamoDB (os endpoints podem ser acessados aqui https://docs.aws.amazon.com/general/latest/gr/ddb.html) e o endpoint do sistema legado.
- No arquivo `\cron\cron.yml` altere o `rate: rate(1 minute)` para `rate: cron(*/1 * * * ? *)` nas duas referências.

Para executar na AWS  é necessário criar uma tabela no DynamoDB chamanda `point` e chave `primária id: string.`

![alt text](https://github.com/jorgekg/point-record-serverless/blob/master/images/DynamoDB-create.PNG?raw=true)

Para teste de performance não esqueça de marcar as opção de auto escalamento do banco.

![alt text](https://github.com/jorgekg/point-record-serverless/blob/master/images/auto-scaling.PNG?raw=true)

Configure as chaves para deploy `serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY -o`.
`As chaves aqui são meramente ilustrativas`

Por fim rode o comando `sls deploy`.

Vale lembrar que a API OData pode levar até 1 minuto para estar disponível, após a inserção dos dados!
`Para facilitar uma coleção do postman esta disponível aqui https://github.com/jorgekg/point-record-serverless/blob/master/point-record.postman_collection.json`
