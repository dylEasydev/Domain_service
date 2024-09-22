import { 
    InferAttributes, InferCreationAttributes, Model,
    CreationOptional,ForeignKey, Association,NonAttribute
} from 'sequelize';
import { FollowDomainInterface , DomainInterface ,User} from '../interface';
import { Domain } from './domain.model';

export class FollowDomain extends Model<
    InferAttributes<FollowDomain>,
    InferCreationAttributes<FollowDomain>
>implements FollowDomainInterface{
    declare id:CreationOptional<number>
    declare userId:User['id'];
    declare domainId:ForeignKey<DomainInterface['id']>;

    //objets de eagger logging . ref << doc sequeilize >>
    declare domain?:NonAttribute<DomainInterface>;

    declare readonly createdAt:CreationOptional<Date>;
    declare readonly updatedAt:CreationOptional<Date>;
    declare readonly deletedAt:CreationOptional<Date>;

    //alias d'associations
    declare static associations: { 
        domain: Association<FollowDomain, Domain>; 
    };
}