# PSI14

O projeto deve ser executado no servidor appserver.alunos.di.fc.ul.pt

O acesso ao servidor é feito através de ssh, sendo o username "psi014" e a password inicial é "psi014" (que deve ser alterada após o primeiro login):

> ssh psi014@appserver.alunos.di.fc.ul.pt

O appserver tem instalados node, npm e mongo (além disso, todos os módulos necessários para funcionamento do projeto devem ser instalados recorrendo ao npm)

A base de dados do grupo criada no servidor mongo tem o nome "psi014"

O utilizador do grupo no servidor mongo tem o nome "psi014" e a password "psi014"

Para acederem à consola do mongo, usem o comando:

> mongo --username psi014 --password --authenticationDatabase psi014 appserver.alunos.di.fc.ul.pt/psi014

O grupo tem dois portos abertos para acesso por http a servidores node (onde o primeiro porto no intervalo 3001 a 3035 e o segundo porto no intervalo 3051 a 3085)

- O grupo (psi014) deve usar os portos 3014 e 3064 (por isso, é importante que configurem os servidores node, para o front-end e back-end, nesses portos)

A forma de executar o servidor node que serve o front-end Angular deve ser a seguinte (onde XXXX define o porto):

> ng serve --port XXXX --host 0.0.0.0 --disableHostCheck true

Para o servidor node que serve o back-end, não é necessário mudar a forma de execução

A connection string para acesso à base de dados mongo deve ser a seguinte:

> mongodb://psi014:psi014@localhost:27017/psi014?retryWrites=true&authSource=psi014