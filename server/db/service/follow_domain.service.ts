import { sequelizedb2,sequelizedb1 } from '../config';
import { DomainInterface } from '../interface';
import { Domain, FollowDomain , Image} from '../../db';
import { FollowDomainServiceInterface } from './interface';

class FollowDomainService implements FollowDomainServiceInterface{
    
    findDomainFollow(userId:number,limit?:number,search=''){
        return new Promise<{ count:number; rows:DomainInterface[];}>(async(resolve, reject) => {
            try {
                const tableDomain = await sequelizedb2.transaction(async t=>{
                    const tableFollow = await FollowDomain.findAndCountAll({
                        where:{
                            userId
                        },
                        include:[
                            {
                                association:FollowDomain.associations.domain,
                                attributes:{
                                    include:[
                                        [
                                            sequelizedb2.literal(
                                                sequelizedb2.getDialect()!=='postgres'?
                                                `(
                                                SELECT COUNT(*) from followDomain as fd
                                                WHERE
                                                    fd.domainId = Domain.id
                                            )`:  `(
                                                SELECT COUNT(*) from "followDomain"
                                                WHERE
                                                    "domainId" = "Domain"."id"
                                            )`),`nbreSubscribe`
                                        ]
                                    ]
                                }
                            }
                        ],
                        limit,
                        order:[
                            ['createdAt','DESC']
                        ]
                    })

                    let tableDomain = tableFollow.rows.map(value=>{
                        return value.domain as DomainInterface;
                    })
                    tableDomain = await sequelizedb1.transaction(async t=>{
                        return await Promise.all(tableDomain.map(async elts=>{
                            const picture = await Image.findOne({
                                where:{
                                    foreignId:elts.id,
                                    nameTable:Domain.tableName
                                },
                                transaction:t
                            });
                            elts.image = picture?.urlPictures;
                            return {...elts.dataValues, image: elts.image} as DomainInterface;
                        }))
                    })
                    return {rows:tableDomain , count:tableFollow.count};
                }) 
                resolve(tableDomain)
            } catch (error) {
                reject(error);
            }
        })
    }
    
    deSubscribeDomain(userId: number, domainId: number){
        return new Promise<void>(async (resolve, reject) => {
            try {
                await sequelizedb2.transaction(async t=>{
                    await FollowDomain.destroy({
                        where:{
                            userId,
                            domainId
                        },
                        force:true
                    });
                })
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new FollowDomainService();