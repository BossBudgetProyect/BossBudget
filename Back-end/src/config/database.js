const mysql = require('mysql2');

// Crear pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'bossbudget',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// Convertir a Promise-based
const promisePool = pool.promise();

// Probar la conexión
promisePool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a la base de datos MySQL - BossBudget');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Error conectando a la base de datos:', error.message);
        console.error('💡 Verifica que:');
        console.error('   - MySQL esté corriendo');
        console.error('   - Las credenciales en .env sean correctas');
        console.error('   - La base de datos exista');
        process.exit(1);
    });

module.exports = promisePool;