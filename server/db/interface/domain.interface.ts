import { 
    CreationOptional,InferAttributes, InferCreationAttributes, Model, 
    NonAttribute,CreateOptions
} from 'sequelize';
import { ImageInterface } from './image.interface';

export interface DomainInterface extends Model<
    InferAttributes<DomainInterface>,
    InferCreationAttributes<DomainInterface>
>{
    id:CreationOptional<number>;
    domainName:string;
    domainDescript:CreationOptional<string>;
    image?:NonAttribute<string>;


    createImage(
        value?:{urlPictures?:string; picturesName?:string},
        options?:CreateOptions<InferAttributes<ImageInterface>>
    ):Promise<ImageInterface>;

    readonly createdAt:CreationOptional<Date>;
    readonly updatedAt:CreationOptional<Date>;
    readonly deletedAt:CreationOptional<Date>;
}