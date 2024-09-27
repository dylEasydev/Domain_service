import { sequelizedb2 } from '../config';
import {FollowDomain} from '../models';
import{DataTypes} from 'sequelize';

FollowDomain.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    userIp:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true,
        validate:{
            isIP:{msg:`Veillez fournir une addresse IP valide !`}
        }
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            isInt:{msg:`Identifiant de l'utilisateur doit être un entier !`}
        }
    },
    createdAt: DataTypes.DATE ,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
},{
    sequelize:sequelizedb2,
    paranoid:true,
    timestamps:true,
    tableName:'followDomain'
})          

export {FollowDomain};