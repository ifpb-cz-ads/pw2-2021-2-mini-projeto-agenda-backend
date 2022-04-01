const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgEmail = require('@sendgrid/mail');
const db = require('../config/db.config');
const User = db.user;

// Cadastrar usuário
exports.userCreate = async (req, res) => {
  let user = null;
  try {
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
  } catch (error) {
    res.json({ message: error.message });
  }

  if (user != null) {
    return res.status(400).json({ message: 'E-mail já cadastrado.' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = Object.assign({}, req.body);
  newUser.password = hashedPassword;

  try {
    user = await User.create(newUser);
    console.log(user);

    const token = jwt.sign({ user_id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: '1h',
    });

    sgEmail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
      to: newUser.email,
      from: process.env.EMAIL_SENDER,
      subject: 'Email de verificação',
      text: 'Clique no link abaixo para confirmar seu cadastro!',
      html: `<p>Olá ${user.username}! <a href="${process.env.HOST_URL}/register-confirmation?token=${token}"><b>Clique aqui para confirmar seu cadastro</b></a> 🚀</p>`,
    };

    await sgEmail
      .send(message)
      .then((response) => console.log(response))
      .catch((error) => console.log(error.message));

    res.json({ usuario: user.id, token: token });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Confirmar usuário
exports.userConfirmation = async (req, res) => {
  const { token } = req.query;

  try {
    const { user_id } = jwt.verify(token, process.env.TOKEN_SECRET);

    await User.update(
      { isVerified: true },
      {
        where: {
          id: user_id,
        },
      }
    );

    return res.status(200).json({ message: 'Usuário confirmado com sucesso' });
  } catch (error) {
    return res.status(400).json({ message: 'Token Inválido' });
  }
};

// Fazer login
exports.userLogin = async (req, res) => {
  let user = null;
  try {
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
  } catch (err) {
    res.json({ message: err.message });
  }

  if (!user.isVerified)
    return res.status(400).json({ message: 'Usuário não verificado!' });

  const message = 'E-mail ou senha inválidos.';
  if (user == null) {
    return res.status(400).json({ message: message });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: message });
  }

  const token = jwt.sign({ user_id: user.id }, process.env.TOKEN_SECRET);
  res.header('Auth-Token', token).json({ token: token, isAdmin: user.isAdmin });
};

// Retorna a lista os usuários
exports.usersList = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'username',
        'email',
        'isVerified',
        'isAdmin',
        'createdAt',
        'updatedAt',
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Atualizar dados do usuário
exports.updateUser = async (req, res) => {
  const { email, username, password } = req.body;
  const { user_id } = req.params;

  try {
    await User.update(
      { email, username, password },
      { where: { id: user_id } }
    );

    return res
      .status(201)
      .json({ message: 'Dados do usuario foram atualizados com sucesso!' });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    await User.destroy({ where: { id: user_id } });

    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Deletar usuários não verificados dentro de 1h
exports.deleteNonVerifiedUsers = async () => {
  const dateNow = new Date();

  const users = await User.findAll({
    where: {
      isVerified: false,
    },
  });

  await Promise.all(
    users.map(async (user) => {
      const userCreatedDate = new Date(user.createdAt);

      if (
        dateNow.getHours() > userCreatedDate.getHours() &&
        dateNow.getMinutes() > userCreatedDate.getMinutes()
      ) {
        await User.destroy({
          where: {
            id: user.id,
          },
        });
      }
    })
  );

  console.log('Usuarios não verificados foram apagados');
};
