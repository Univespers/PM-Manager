-- Testes manuais

-- Usar o banco de dados
USE pm_manager;

-- Criação de Admin
CALL CREATE_ADMIN('000.000.000-00', 'senha123');
SELECT * FROM Admin; -- Deve conter o novo admin

-- Login de Admin
CALL LOGIN_ADMIN('000.000.000-00', 'senha123');
SELECT * FROM Login; -- Deve conter o novo admin

-- Logout de Admin
CALL LOGOUT_ADMIN(''); -- Requer o LoginUUID!
SELECT * FROM Login; -- Deve estar vazio

-- Remoção de Admin
CALL LOGIN_ADMIN('000.000.000-00', 'senha123');
CALL DELETE_ADMIN(''); -- Requer o LoginUUID!
SELECT * FROM Admin; -- Deve estar vazio
