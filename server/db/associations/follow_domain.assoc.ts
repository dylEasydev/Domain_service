import { Domain, FollowDomain } from '../init';

FollowDomain.belongsTo(Domain,{
    foreignKey:{
        name:'domainId',
        allowNull:false
    },
    targetKey:'id',
    hooks:true,
    onDelete:'CASCADE',
    as:'domain'
})

export {FollowDomain};