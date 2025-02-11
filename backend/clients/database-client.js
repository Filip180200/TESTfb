import { Sequelize } from 'sequelize';

import Admin from '../models/00-admin';
import Template from '../models/01-template';
import Language from '../models/03-language';
import Page from '../models/02-page';
import Info from '../models/05-info';
import Finish from '../models/06-finish';
import Register from '../models/07-register';
import Question from '../models/08-question';
import McqOption from '../models/09-mcq-option';
import User from '../models/10-user';
import UserPost from '../models/11-user-post';
import UserPostAuthor from '../models/18-user-post-author';
import UserPostAction from '../models/12-user-post-action';
import UserRegister from '../models/13-user-register';
import UserAnswer from '../models/14-user-answer';
import Media from '../models/15-media';
import UserPostTracking from '../models/16-user-post-tracking';
import UserGlobalTracking from '../models/17-user-global-tracking';
import { databaseConfigurations } from '../utils';

const sequelize = new Sequelize(
  process.env.DB_NAME || databaseConfigurations.database.name,
  process.env.DB_USERNAME || databaseConfigurations.database.username,
  process.env.DB_PASSWORD || databaseConfigurations.database.password,
  {
    host: process.env.DB_HOST || databaseConfigurations.database.host,
    port: process.env.DB_PORT || databaseConfigurations.database.port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Important for Supabase
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};
const AdminModel = Admin(sequelize, Sequelize);
const TemplateModel = Template(sequelize, Sequelize);
const LanguageModel = Language(sequelize, Sequelize);
const PageModel = Page(sequelize, Sequelize);
const InfoModel = Info(sequelize, Sequelize);
const FinishModel = Finish(sequelize, Sequelize);
const RegisterModel = Register(sequelize, Sequelize);
const QuestionModel = Question(sequelize, Sequelize);
const McqOptionModel = McqOption(sequelize, Sequelize);
const UserModel = User(sequelize, Sequelize);
const UserPostModel = UserPost(sequelize, Sequelize);
const UserPostAuthorModel = UserPostAuthor(sequelize, Sequelize);
const UserPostActionModel = UserPostAction(sequelize, Sequelize);
const UserRegisterModel = UserRegister(sequelize, Sequelize);
const UserAnswerModel = UserAnswer(sequelize, Sequelize);
const MediaModel = Media(sequelize, Sequelize);
const UserPostTrackingModel = UserPostTracking(sequelize, Sequelize);
const UserGlobalTrackingModel = UserGlobalTracking(sequelize, Sequelize);

db[AdminModel.name] = AdminModel;
db[TemplateModel.name] = TemplateModel;
db[LanguageModel.name] = LanguageModel;
db[PageModel.name] = PageModel;
db[InfoModel.name] = InfoModel;
db[FinishModel.name] = FinishModel;
db[RegisterModel.name] = RegisterModel;
db[QuestionModel.name] = QuestionModel;
db[McqOptionModel.name] = McqOptionModel;
db[UserModel.name] = UserModel;
db[UserPostModel.name] = UserPostModel;
db[UserPostAuthorModel.name] = UserPostAuthorModel;
db[UserPostActionModel.name] = UserPostActionModel;
db[UserRegisterModel.name] = UserRegisterModel;
db[UserAnswerModel.name] = UserAnswerModel;
db[MediaModel.name] = MediaModel;
db[UserPostTrackingModel.name] = UserPostTrackingModel;
db[UserGlobalTrackingModel.name] = UserGlobalTrackingModel;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
