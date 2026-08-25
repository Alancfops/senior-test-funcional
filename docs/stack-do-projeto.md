# Com o que o Sênior Teste Funcional foi feito

O **Sênior Teste Funcional** é um aplicativo para fisioterapeutas registrarem e acompanharem testes funcionais com pacientes idosos. Por baixo do que aparece na tela, o sistema foi montado em três partes simples.

**O aplicativo no celular**  
Foi feito com **Expo** e **React Native**. Na prática, isso significa um app que roda em Android e iPhone, com as telas de login, cadastro de pacientes, aplicação dos testes e histórico. É o que o fisioterapeuta usa no dia a dia.

**O servidor (a parte que fica na nuvem ou no computador da equipe)**  
Foi feito com **NestJS**, rodando em **Node.js**. É quem guarda as regras de verdade — calcula as notas dos testes, garante que cada profissional só vê seus pacientes, gera o PDF e envia o e-mail quando alguém esquece a senha. O celular mostra e coleta informação; quem decide o resultado é o servidor.

**O banco de dados**  
Usamos **PostgreSQL**, um sistema confiável para guardar contas, pacientes, avaliações e resultados ao longo do tempo. O **Prisma** ajuda o servidor a conversar com esse banco de forma organizada.

**Por que essas escolhas**  
Queríamos algo mobile de verdade, seguro para dados de saúde, e que uma equipe pequena consiga manter. Por isso apostamos em ferramentas já usadas no mercado, em vez de montar tudo do zero ou com coisas muito experimentais.

Se no futuro o projeto crescer, dá para trocar partes pontuais — como o serviço de e-mail — sem refazer o app inteiro.
