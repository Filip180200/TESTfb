import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function updateRouteFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Replace require with import
        let updatedContent = fileContent
            .replace(/var express = require\('express'\)/g, "import express from 'express'")
            .replace(/const express = require\('express'\)/g, "import express from 'express'")
            .replace(/var router = express\.Router\(\)/g, "const router = express.Router()")
            .replace(/module\.exports = router/g, "export default router");
        
        fs.writeFileSync(filePath, updatedContent);
    });
}

function updateMigrationFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Replace require with import for Sequelize
        let updatedContent = fileContent
            .replace(/const { Sequelize } = require\('sequelize'\)/g, "import { Sequelize } from 'sequelize'")
            .replace(/module\.exports = {/g, "export default {");
        
        fs.writeFileSync(filePath, updatedContent);
    });
}

// Update route files
updateRouteFiles(path.join(__dirname, 'routes'));

// Update migration files
updateMigrationFiles(path.join(__dirname, 'migrations'));

console.log('Import updates completed!');
