import { 
    InferAttributes, InferCreationAttributes,
    CreationOptional,Model,NonAttribute,CreateOptions
} from 'sequelize';
import { DomainInterface, ImageInterface } from '../interface';
import { Image } from './image.model';

export class Domain extends Model <
    InferAttributes<Domain>,
    InferCreationAttributes<Domain>
>implements DomainInterface{
    
    declare id:CreationOptional<number>;
    declare domainName:string;
    declare domainDescript:CreationOptional<string>;
    declare image?:NonAttribute<string>;

    declare readonly createdAt:CreationOptional<Date>;
    declare readonly updatedAt:CreationOptional<Date>;
    declare readonly deletedAt:CreationOptional<Date>;

    createImage(
        value?:{urlPictures?:string; picturesName?:string},
        options?:CreateOptions<InferAttributes<ImageInterface>>
    ){
        return new Promise<ImageInterface>(async (resolve, reject) => {
            try {
                const image = await Image.create({
                    foreignId:this.id,
                    nameTable:Domain.tableName,
                    urlPictures:value?.urlPictures,
                    picturesName:value?.picturesName
                },options);
                resolve(image);
            } catch (error) {
                reject(error);
            }
        })
    }
}