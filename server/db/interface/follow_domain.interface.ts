import { 
    CreationOptional,ForeignKey,NonAttribute,
    InferAttributes, InferCreationAttributes, Model 
} from 'sequelize';
import { User , DomainInterface} from '../interface';

export interface FollowDomainInterface extends Model<
    InferAttributes<FollowDomainInterface>, 
    InferCreationAttributes<FollowDomainInterface>
>
{
    id:CreationOptional<number>
    userId:CreationOptional<User['id']|null>;
    domainId:ForeignKey<DomainInterface['id']>;
    userIp:CreationOptional<string|null>;

    domain?:NonAttribute<DomainInterface>;
    
    readonly createdAt:CreationOptional<Date>;
    readonly updatedAt:CreationOptional<Date>;
    readonly deletedAt:CreationOptional<Date>;
}