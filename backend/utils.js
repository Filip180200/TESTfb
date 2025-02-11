import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const environment = process.env.NODE_ENV || 'production';
const configPath = path.join(__dirname, `config-${environment}.json`);

// Read config file manually
const configContent = await readFile(configPath, 'utf8');
const config = JSON.parse(configContent);

export const databaseConfigurations = () => {
  if (!config.database) console.log('Please provide a database object');
  let db = {
    ...config.database
  };
  if (environment === 'development') {
    // This is when running frontend and backend locally in docker
    // then we want to connect our backend to listen to local sql instance
    if (process.env.MYSQL_HOST) return { ...db, host: process.env.MYSQL_HOST }
  }
  return db;
}

export const adminCredConfigurations = () => {
  if (config.adminCredentials) return config.adminCredentials;
  else console.log('Please provide a database object!')
}

export const secretConfigurations = () => {
  if (config.secret) return config.secret;
  else console.log('Please provide a Secret!')
}

export const checkIfValidAndNotEmptyArray = (arr) => {
  return (arr && Array.isArray(arr) && arr.length > 0);
}

export const checkIfValidAndNotEmptyObj = (obj) => {
  return (obj && typeof obj === 'object' && (JSON.stringify(obj) !== '{}'));
}

export const isNumeric = (num) => {
  return !isNaN(num);
}

// this will shuffle the array in place
// make sure to give this a new array
export const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while ( 0 !== currentIndex ) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const getNumberOrZero = (num) => {
  let integer = parseInt(num, 10);
  if (!isNaN(integer)) {
    return integer;
  }
  return 0;
}