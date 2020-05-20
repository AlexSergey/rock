import { Model, DataTypes } from 'sequelize';
import { cryptPassword, isValidPassword } from '../utils/auth';
import { postFactory } from './Post';
import { statisticFactory } from './Statistic';
import { statisticTypeFactory } from './StatisticType';
import { InternalError, PostNotFound } from '../errors';

export interface UserInterface {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const userFactory = (sequelize) => {
  class User extends Model<UserInterface> {
    isValidPassword = async (userPassword, password): Promise<boolean> => await isValidPassword(userPassword, password);
  }

  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },

    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isEmail: true,
        min: 5
      },
      unique: true
    },

    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        min: 5
      },
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      }
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {
    tableName: 'users',
    sequelize,
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    hooks: {
      beforeCreate: async (user): Promise<void> => {
        const { cryptedPassword } = await cryptPassword(user.get('password'));

        user.setAttributes({
          password: cryptedPassword
        });
      },

      afterCreate: async (user): Promise<void> => {
        const Statistic = statisticFactory(sequelize);
        const StatisticType = statisticTypeFactory(sequelize);

        const typeEntity = await StatisticType.findOne({
          where: {
            type: 'user'
          }
        });

        try {
          await Statistic.create({
            type_id: typeEntity.get('id'),
            entity_id: user.get('id'),
            posts: 0,
            comment: 0
          });
        } catch (e) {
          throw new InternalError();
        }
      },

      beforeDestroy: async (user): Promise<void> => {
        const Post = postFactory(sequelize);

        try {
          await Post.destroy({
            where: {
              user_id: user.get('id')
            },
            individualHooks: true
          });
        } catch (e) {
          throw new PostNotFound();
        }
      }
    }
  });

  User.sync();

  return User;
};
