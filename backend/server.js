import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from "bcryptjs";
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { databaseConfigurations, adminCredConfigurations } from './utils.js';

import auth from './routes/auth-routes.js';
import authUser from './routes/user-auth-routes.js';

import template from './routes/template-routes.js';
import register from './routes/register-routes.js';
import finish from './routes/finish-routes.js';
import info from './routes/info-routes.js';
import question from './routes/question-routes.js';
import media from './routes/media-routes.js';
import language from './routes/language-routes.js';
import page from './routes/page-routes.js';
import metrics from './routes/admin-metrics-routes.js';
import adminUserPost from './routes/admin-userpost-routes.js';

import userRegister from './routes/user-register-routes.js';
import userFinish from './routes/user-finish-routes.js';
import userInfo from './routes/user-info-routes.js';
import userFacebook from './routes/facebook-routes.js';
import userQuesion from './routes/user-question-routes.js';
import userAnswer from './routes/user-answer-routes.js';
import userMain from './routes/user-main-routes.js';
import userTracking from './routes/user-tracking-routes.js';

import { verifyToken, isAdmin } from "./middleware/authJwt.js";
import { verifyUserToken, isUser } from "./middleware/userAuthJwt.js";
import db from "./clients/database-client.js";
import { umzugUp } from './migrations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkConfigFileExist = () => {
  const pathToConfigFile = path.join(__dirname, `config-${process.env.NODE_ENV}.json`);
  if (!fs.existsSync(pathToConfigFile)) {
    throw new Error(`Config file not found: ${pathToConfigFile}`);
  }
};

const testConnection = async () => {
  console.log('Checking if database exist...');
  try {
    let dbConfig = databaseConfigurations();
    console.log('Opening connection...');
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      password: dbConfig.password,
      debug: false
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.name}\`;`);
    console.log('Database has been successfully checked and/or created.');
    await connection.end();
    console.log('Connection closed!');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

const checkAndCreateAdmins = async () => {
  let transaction;
  try {
    let config = adminCredConfigurations();
    transaction = await db.sequelize.transaction();
    let promisses = [];
    // Save Admin object from config to the database
    if (config && config instanceof Array) {
      for (let i = 0; i < config.length; i++) {
        // check if user with the username exist, if it exist do not do anything
        const data = await db.Admin.findOne({
          where: {
            username: config[i].username
          }
        });
        if (data) console.log(`Skipping user with name ${config[i].username} as it already exist`);
        else {
          const admin = {
            username: config[i].username,
            password: bcrypt.hashSync(config[i].password, 8)
          };
          promisses.push(db.Admin.create(admin, { transaction }));
          console.log(`Creating Admin with username: ${config[i].username}`);
        }
      }
    }
    await Promise.all(promisses);
    await transaction.commit();
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error creating admins:', error);
    throw error;
  }
};

const startServer = async () => {
  try {
    checkConfigFileExist();
    await testConnection();
    await umzugUp();
    console.log('Tables Created, Migrations ran successfully!');

    console.log('Trying to inserting entries for admin credentials in the database!');
    await checkAndCreateAdmins();

    // create a express server
    const app = express();
    const environment = process.env.NODE_ENV;
    var corsOptions = {
      origin: environment === 'development' ? ['http://localhost', 'http://localhost:8080'] : ['https://studysocial.media', 'https://www.studysocial.media'],
    };

    app.use(cors(corsOptions));
    app.use(express.json({ limit: '1gb' }));
    app.use(express.urlencoded({ extended: true, limit: '1gb' }));

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    // simple route
    app.use('/api/admin/login', auth);
    app.use('/api/user/login', authUser);

    // add middleware to our application
    app.use('/api/template', [verifyToken, isAdmin], template);
    app.use('/api/register', [verifyToken, isAdmin], register);
    app.use('/api/info', [verifyToken, isAdmin], info);
    app.use('/api/finish', [verifyToken, isAdmin], finish);
    app.use('/api/questions', [verifyToken, isAdmin], question);
    app.use('/api/language', [verifyToken, isAdmin], language);
    app.use('/api/page', [verifyToken, isAdmin], page);
    app.use('/api/media', [verifyToken, isAdmin], media);
    app.use('/api/metrics', [verifyToken, isAdmin], metrics);
    app.use('/api/userposts', [verifyToken, isAdmin], adminUserPost);

    app.use('/api/user/questions', [verifyUserToken, isUser], userQuesion);
    app.use('/api/user/answer', [verifyUserToken, isUser], userAnswer);
    app.use('/api/user/register', [verifyUserToken, isUser], userRegister);
    app.use('/api/user/finish', [verifyUserToken, isUser], userFinish);
    app.use('/api/user/info', [verifyUserToken, isUser], userInfo);
    app.use('/api/user/facebook', [verifyUserToken, isUser], userFacebook);
    app.use('/api/user/main', [verifyUserToken, isUser], userMain);
    app.use('/api/user/tracking', [verifyUserToken, isUser], userTracking);

    // set port, listen for requests
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Error: ', error);
    process.exit(1);
  }
}

startServer();
