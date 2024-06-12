import { sequelizedb2 } from '../config';
import {FollowDomain} from '../models';
import{DataTypes} from 'sequelize';

FollowDomain.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    userId:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false,
        validate:{
            isInt:{msg:`identifiant de l'utilisateur doit être un entier !`}
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