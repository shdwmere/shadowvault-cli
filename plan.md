O Banco de Dados (Substituindo o MongoDB)

- Como você vai usar um arquivo local criptografado (vault.json), podemos eliminar completamente o Express, Mongoose, JWT, CORS e Swagger. Toda a autenticação e a descriptografia do arquivo serão baseadas em uma Master Password que o usuário digita ao abrir o app.  
- Arquivo JSON Criptografado Puro: Como o volume de dados de senhas é baixo, seu "banco" pode ser um único arquivo vault.json. Quando o script inicia, ele descriptografa o arquivo na memória usando a sua chave mestre (AES-256). Quando você adiciona uma senha, o script atualiza a memória, criptografa tudo de novo e cospe no arquivo. É o jeito mais seguro que existe.  

---

