const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load the swagger.yaml file from src directory
const loadSwaggerDocument = () => {
    const swaggerPath = path.join(__dirname, '../swagger.yaml');
    const fileContents = fs.readFileSync(swaggerPath, 'utf8');
    return yaml.load(fileContents);
  };

  module.exports = loadSwaggerDocument;