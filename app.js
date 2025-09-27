const express = require('express');
const swaggerUI = require('swagger-ui-express');
const env = require('dotenv')
const authRoutes = require('./src/Route/AuthenticationRoute');
const fileRoutes = require('./src/Route/FileRoute');
const fs = require('fs');
const path = require('path');
const loadSwaggerDocument = require('./src/Function/swagger.js');
const app = express();

env.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const observationRoutes = require("./src/Route/ObservationRoute");
app.use("/api/observations", observationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);

// Swagger
const swaggerDocument = loadSwaggerDocument();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
