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

-- Preparo
CALL CREATE_ADMIN('000.000.000-00', 'senha123');
CALL LOGIN_ADMIN('000.000.000-00', 'senha123');

-- Criação de User
CALL CREATE_USER('000.000.000-00', 'senha123', ''); -- Requer o LoginUUID do Admin!
SELECT * FROM User; -- Deve conter o novo user

-- Login de User
CALL LOGIN_USER('000.000.000-00', 'senha123');
SELECT BIN_TO_UUID(uuid) FROM Login WHERE user_id IS NOT NULL; -- Deve conter o novo user

-- Update de User
CALL UPDATE_USER('000.000.000-00', '{nome:"Teste",idade:99}', ''); -- Requer o LoginUUID do Admin!
SELECT * FROM User; -- Deve conter o JSON no campo

-- List de User
CALL LIST_USERS(''); -- Requer o LoginUUID do Admin!

-- Logout de User
CALL LOGOUT_USER(''); -- Requer o LoginUUID do User!
SELECT BIN_TO_UUID(uuid) FROM Login WHERE user_id IS NOT NULL; -- Deve estar vazio

-- Remoção de User
CALL DELETE_USER('000.000.000-00', ''); -- Requer o LoginUUID do Admin!
SELECT * FROM User; -- Deve estar vazio

-- Reset
CALL DELETE_ADMIN(''); -- Requer o LoginUUID!
SELECT * FROM Admin; -- Deve estar vazio


-- Folga

-- Preparo
CALL CREATE_ADMIN('000.000.000-00', 'senha123');
CALL LOGIN_ADMIN('000.000.000-00', 'senha123');
CALL CREATE_USER('000.000.000-00', 'senha123', ''); -- Requer o LoginUUID do Admin!

-- Criação de Folga
CALL CREATE_FOLGA('000.000.000-00', ''); -- Requer o LoginUUID do Admin!
SELECT BIN_TO_UUID(uuid) FROM Folga; -- Deve conter a nova folga

-- List de Folga
CALL LIST_FOLGAS('2026-04-01', ''); -- Requer o LoginUUID do Admin!

-- Get de Folga
CALL GET_FOLGA('', ''); -- Requer a FolgaUUID! Requer o LoginUUID do Admin!

-- Update de Folga
CALL UPDATE_FOLGA_DATA('', '2026-04-10', ''); -- Requer a FolgaUUID! Requer o LoginUUID do Admin!
CALL LIST_FOLGAS('2026-04-01', ''); -- Requer o LoginUUID do Admin!
CALL LIST_FOLGAS('2026-05-01', ''); -- Requer o LoginUUID do Admin!
-- O primeiro deve ter 1 valor. O segundo deve estar vazio

-- Update de Folga
CALL UPDATE_FOLGA('', '{comentario:"Teste"}', ''); -- Requer a FolgaUUID! Requer o LoginUUID do Admin!
SELECT * FROM Folga; -- Deve conter o JSON no campo

-- Remoção de Folga
CALL DELETE_FOLGA('', ''); -- Requer a FolgaUUID! Requer o LoginUUID do Admin!
SELECT * FROM Folga; -- Deve estar vazio

-- Reset
CALL DELETE_USER('000.000.000-00', ''); -- Requer o LoginUUID do Admin!
SELECT * FROM User; -- Deve estar vazio
CALL DELETE_ADMIN(''); -- Requer o LoginUUID!
SELECT * FROM Admin; -- Deve estar vazio
