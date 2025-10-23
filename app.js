const express = require('express');
const swaggerUI = require('swagger-ui-express');
const env = require('dotenv');
const authRoutes = require('./src/Route/AuthenticationRoute');
const fileRoutes = require('./src/Route/FileRoute');
const path = require('path');
const loadSwaggerDocument = require('./src/Function/swagger.js');
const { getParameter } = require('./src/parameterStore.js');

const app = express();

env.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const observationRoutes = require("./src/Route/ObservationRoute");
app.use("/api/observations", observationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);

const observationCacheRoutes = require("./src/Route/ObservationCacheRoute");
app.use("/api", observationCacheRoutes);

const sqsRoutes = require("./src/Route/SQSRoute.js");
app.use("/api", sqsRoutes);

// Swagger
const swaggerDocument = loadSwaggerDocument();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// ---- Parameter Store + Server Start ----
(async () => {
  try {
    const serviceUrl = await getParameter("/n10820566/cloubirding");
    console.log("ClouBirding Service URL:", serviceUrl);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start app:", err);
  }
})();
