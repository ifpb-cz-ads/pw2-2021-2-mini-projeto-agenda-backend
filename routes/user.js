const express = require('express');
const router = express.Router();
const verify = require('../utils/verifyToken');

// Importa o controller
const userController = require('../controllers/userController');

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cria um novo usuário.
 *     parameters:
 *       - in: header
 *         name: Auth-Token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário criado.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 */
router.post('/register', userController.userCreate);

/**
 * @swagger
 * /users/confirmation:
 *   get:
 *     summary: Confirma um novo usuário através do token enviado pelo E-mail.
 *     parameters:
 *       - in: query
 *         name: Auth-Token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuário confirmado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 */
router.get('/confirmation', userController.userConfirmation);

/**
 * @swagger
 * /users/login:
 *   get:
 *     summary: Efetua o login de um usuário.
 *     parameters:
 *       - in: header
 *         name: Auth-Token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuário confirmado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 */
router.post('/login', userController.userLogin);

router.get('/', verify, userController.usersList);

router.put('/:id', verify, userController.updateUser);

router.delete('/:id', verify, userController.deleteUser);

module.exports = router;
