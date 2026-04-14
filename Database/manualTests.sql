-- Testes manuais

-- Usar o banco de dados
USE pm_manager;


-- Admin

-- Criação de Admin
CALL CREATE_ADMIN('000.000.000-00', 'senha123');
SELECT * FROM Admin; -- Deve conter o novo admin

-- Login de Admin
CALL LOGIN_ADMIN('000.000.000-00', 'senha123');
SELECT BIN_TO_UUID(uuid) FROM Login; -- Deve conter o novo admin

-- Logout de Admin
CALL LOGOUT_ADMIN(''); -- Requer o LoginUUID!
SELECT * FROM Login; -- Deve estar vazio

-- Remoção de Admin
CALL LOGIN_ADMIN('000.000.000-00', 'senha123');
CALL DELETE_ADMIN(''); -- Requer o LoginUUID!
SELECT * FROM Admin; -- Deve estar vazio


-- User

-- Criação de User
CALL CREATE_ADMIN('000.000.000-00', 'senha123');
CALL LOGIN_ADMIN('000.000.000-00', 'senha123');
CALL CREATE_USER('000.000.000-00', 'senha123',''); -- Requer o LoginUUID do Admin!
SELECT * FROM User; -- Deve conter o novo user

-- Login de User
CALL LOGIN_USER('000.000.000-00', 'senha123');
SELECT BIN_TO_UUID(uuid) FROM Login WHERE user_id IS NOT NULL; -- Deve conter o novo user

-- Logout de User
CALL LOGOUT_USER(''); -- Requer o LoginUUID do User!
SELECT BIN_TO_UUID(uuid) FROM Login WHERE user_id IS NOT NULL; -- Deve estar vazio

-- Remoção de User
CALL DELETE_USER('000.000.000-00', ''); -- Requer o LoginUUID do Admin!
SELECT * FROM User; -- Deve estar vazio
