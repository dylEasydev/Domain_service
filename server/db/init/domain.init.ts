import { sequelizedb2 } from '../config';
import {Domain} from '../models';
import{DataTypes} from 'sequelize';

Domain.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    domainName:{
        type:DataTypes.STRING(30),
        allowNull:false,
        validate:{
            notEmpty:{msg:`Veillez fournir un nom à Votre domaine`},
            notNull:{msg:`Veillez fournir un nom à Votre domaine`},
            len:{
                msg:`le nom du domaine doit être entre 4 et 30 carractères`,
                args: [4 , 30]
            },
            validatePicturesName(value:string){
                if(!value) throw new Error(`Veillez fournir un nom à Votre domaine`);
                if(value.length < 4) throw new Error(`Fournissez au moins 4 carractères pour votre nom de domaine !`);
            }
        }
    },
    domainDescript:{
        type:DataTypes.TEXT('medium'),
        allowNull:true
    },
    createdAt: DataTypes.DATE ,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
},{
    sequelize:sequelizedb2,
    paranoid:true,
    timestamps:true,
    tableName:'domain'
})

export {Domain}; 