import { Domain, FollowDomain } from '../init';

Domain.hasMany(FollowDomain,{
    foreignKey:{
        name:'domainId',
        allowNull:false
    },
    sourceKey:'id',
    hooks:true,
    onDelete:'CASCADE',
    as:'follows'
});

export {Domain};