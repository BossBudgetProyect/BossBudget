const usuarioRepository = require('../repositories/usuarioRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    
    // Login de usuario
    async login(correo, contraseña) {
        if (!correo || !contraseña) {
            throw new Error('Por favor, ingresa correo y contraseña.');
        }

        // Buscar usuario por correo
        const usuario = await usuarioRepository.findByEmail(correo);
        if (!usuario) {
            throw new Error('Correo y/o contraseña incorrectos');
        }

        // Verificar contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.Contraseña);
        if (!contraseñaValida) {
            throw new Error('Correo y/o contraseña incorrectos');
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                correo: usuario.Correo,
                nombreUsuario: usuario.NombreUsuario,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            usuario: usuario.toJSON(),
            token
        };
    }

    // Registro de usuario
    async registrar(datosUsuario, imagenNombre = null) {
        const { username, nombres, apellidos, password, email, profesion, nacimiento, expectativas } = datosUsuario;

        // Validaciones
        if (!username || !nombres || !apellidos || !password || !email) {
            throw new Error('Todos los campos obligatorios deben ser llenados');
        }

        // Verificar que el correo no exista
        const usuarioExistente = await usuarioRepository.findByEmail(email);
        if (usuarioExistente) {
            throw new Error('El correo electrónico ya está registrado');
        }

        // Verificar que el nombre de usuario no exista
        const usernameExistente = await usuarioRepository.findByUsername(username);
        if (usernameExistente) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        // Hashear contraseña
        const contraseñaHasheada = await bcrypt.hash(password, 10);

        // Crear usuario
        const usuario = await usuarioRepository.create({
            NombreUsuario: username,
            Nombres: nombres,
            Apellidos: apellidos,
            Contraseña: contraseñaHasheada,
            Correo: email,
            Profesion: profesion || null,
            FechaDeNacimiento: nacimiento || null,
            Expectativas: expectativas || null,
            Foto: imagenNombre,
            rol: 'userN'
        });

        // Generar token automáticamente después del registro
        const token = jwt.sign(
            { 
                correo: usuario.Correo,
                nombreUsuario: usuario.NombreUsuario,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            usuario: usuario.toJSON(),
            token
        };
    }

    // Obtener perfil de usuario
    async obtenerPerfil(correo) {
        const usuario = await usuarioRepository.findByEmail(correo);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return usuario.toJSON();
    }
}

module.exports = new AuthService();