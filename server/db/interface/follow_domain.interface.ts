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
    userId:User['id'];
    domainId:ForeignKey<DomainInterface['id']>;

    domain?:NonAttribute<DomainInterface>;
    
    readonly createdAt:CreationOptional<Date>;
    readonly updatedAt:CreationOptional<Date>;
    readonly deletedAt:CreationOptional<Date>;
}