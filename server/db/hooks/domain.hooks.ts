import {Domain, Image} from '../init';
import { sequelizedb1 } from '../config';

Domain.afterFind(async (instances , options)=>{
    return new Promise<void>(async(resolve, reject) => {
        try {
            await sequelizedb1.transaction(async t=>{
                if(!instances) instances = [] as Domain[];
                else if(!Array.isArray(instances))instances =[instances] as Domain[]; 
                await Promise.all(instances.map(async elts=>{
                    const picture = await Image.findOne({
                        where:{
                            foreignId:elts.id,
                            nameTable:Domain.tableName
                        },
                        transaction:t
                    });
                    elts.image = picture?.urlPictures;
                }))
            })
            resolve();
        } catch (error) {
            reject(error);
        }
    })
})

export {Domain};