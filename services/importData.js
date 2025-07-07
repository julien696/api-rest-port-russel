require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MODELS_PATH = path.join(__dirname, '../models');
const DATA_PATH = path.join(__dirname, '../data');

async function loadModels() {
const models = {};
const files = fs.readdirSync(MODELS_PATH);

files.forEach((file) => {
if (file.endsWith('.js')) {
const modelPath = path.join(MODELS_PATH, file);
const model = require(modelPath);
models[model.modelName] = model;
}
});

return models;
}

async function loadData(models) {
const dataFiles = fs.readdirSync(DATA_PATH);

for (const file of dataFiles) {
if (!file.endsWith('.json')) continue;

const modelName = path.basename(file, '.json'); // ex: users → User ?
const modelKey = Object.keys(models).find(
(key) => key.toLowerCase() === modelName.toLowerCase() ||
key.toLowerCase() + 's' === modelName.toLowerCase()
);

if (!modelKey) {
console.warn(`Aucun modèle trouvé pour ${file}`);
continue;
}

const Model = models[modelKey];
const json = JSON.parse(fs.readFileSync(path.join(DATA_PATH, file), 'utf-8'));

await Model.deleteMany({});
await Model.insertMany(json);
console.log(`Données insérées pour : ${modelKey}`);
}
}

async function main() {
await mongoose.connect(process.env.MONGODB_URI, {
});

const models = await loadModels();
await loadData(models);

mongoose.connection.close();
console.log('Seeding terminé avec succès');
}

main().catch((err) => {
console.error('Erreur lors du seeding :', err);
process.exit(1);
});