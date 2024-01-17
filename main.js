const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const project3Router = express.Router();
const listEditRouter = express.Router();
const listViewRouter = express.Router();

const port = 8080;

const users = [
    { username: 'usuario1', password: 'clave1' },
    { username: 'usuario2', password: 'clave2' },
   
];

// Ruta de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verifica las credenciales del usuario
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Crea un token JWT
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});

// Middleware para validar el token en las rutas protegidas
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Acceso prohibido. Token inválido.' });
        }

        req.user = user;
        next();
    });
}

// Ruta protegida
app.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Acceso autorizado a la ruta protegida', user: req.user });
});

// Implementa las rutas existentes con los middlewares adecuados
listEditRouter.use('/create', authenticateToken, (req, res, next) => {
    // Tu lógica para list-edit/create
    next();
});

listEditRouter.use('/update', authenticateToken, (req, res, next) => {
    // Tu lógica para list-edit/update
    next();
});

// Middleware a nivel de aplicación para gestionar métodos HTTP válidos
app.use((req, res, next) => {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!validMethods.includes(req.method)) {
        return res.status(400).send('Método HTTP no válido');
    }
    next();
});

// Middleware para list-view-router que gestiona parámetros incorrectos
listViewRouter.use('/:id', authenticateToken, (req, res, next) => {
    const id = req.params.id;

    if (!isValidId(id)) {
        return res.status(400).send('Parámetro incorrecto');
    }
    next();
});

// Ejemplo de una ruta para probar el middleware list-view-router
listViewRouter.get('/:id', authenticateToken, (req, res) => {
    res.send(`Vista de la lista con ID ${req.params.id}`);
});

// Asigna los routers a las rutas específicas
app.use('/project-3', project3Router);
project3Router.use('/list-edit', listEditRouter);
project3Router.use('/list-view', listViewRouter);

function isValidId(id) {
    return /^\d+$/.test(id);
}

app.use(express.json());

// Ruta de prueba para asegurarse de que la aplicación está en funcionamiento
app.get('/this-should-exists', (req, res) => {
    res.status(404).send('Not found');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
