const express = require('express');
const app = express();
const project3Router = express.Router();
const listEditRouter = express.Router();
const listViewRouter = express.Router();

const port = 8080;

listEditRouter.use('/create', (req, res, next) => {
    if (req.method === 'POST') {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send('Cuerpo de solicitud vacío');
        }
        
    }
    next();
});

// Middleware para manejar solicitudes PUT con cuerpo vacío o información no válida
listEditRouter.use('/update', (req, res, next) => {
    if (req.method === 'PUT') {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send('Cuerpo de solicitud vacío');
        }
       
    }
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
listViewRouter.use('/:id', (req, res, next) => {
    const id = req.params.id;
  
    if (!isValidId(id)) {
        return res.status(400).send('Parámetro incorrecto');
    }
    next();
});

// Ejemplo de una ruta para probar el middleware list-view-router
listViewRouter.get('/:id', (req, res) => {
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
