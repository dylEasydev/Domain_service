import { sequelizedb1, sequelizedb2 } from '../config';
import { DomainInterface, FollowDomainInterface } from '../interface';
import { Domain, FollowDomain,Image } from '../../db';
import { DomainInterfaceService } from './interface';
import { Op } from 'sequelize';
import { __urlImage } from '../../global_dir';

class DomaineService implements DomainInterfaceService{
    createDomain<
    T extends {domainName:string; domainDescript?:string;}
    >(value:T){
        return new Promise<DomainInterface>(async(resolve, reject) => {
            try {
                const newDomain = await sequelizedb2.transaction(async t=>{
                    const domain = await Domain.create({
                        domainName:value.domainName,
                        domainDescript:value.domainDescript
                    },{transaction:t});

                    domain.image = await sequelizedb1.transaction(async t1=>{
                        const picture = await domain.createImage({
                            picturesName:'domain_default.png',
                            urlPictures:`${__urlImage}/public/domain_default.png`
                        },{transaction:t1})
                        return picture.urlPictures;
                    })

                    return domain;
                })
                resolve(newDomain);
            } catch (error) {
                reject(error);
            }
        })
    }

    updateDomain<
        T extends {domainName?:string; domainDescript?:string}
     >(instance:DomainInterface , value:T){
        return new Promise<DomainInterface>(async(resolve, reject) => {
            try {
                const domainUpdate = await sequelizedb1.transaction(async t=>{
                    return await instance.update(value)
                })
                resolve(domainUpdate)
            } catch (error) {
                reject(error);
            }
        })
    }

    findDomainById(id:number){
        return new Promise<DomainInterface|null>(async(resolve, reject) => {
            try {
                const domainFind = await sequelizedb2.transaction(async t=>{
                    return await Domain.findByPk(id,{
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
                    });
                });
                if(domainFind !== null){
                    domainFind.image = await sequelizedb1.transaction(async t =>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:domainFind.id,
                                nameTable:Domain.tableName
                            },
                            transaction:t
                        });
                        return picture?.urlPictures;
                    });
                    resolve({...domainFind?.dataValues , image: domainFind?.image} as Domain);
                }else resolve(domainFind);
            } catch (error) {
                reject(error);
            }
        })
    }

    findDomainByName(name:string){
        return new Promise<DomainInterface|null>(async(resolve, reject) => {
            try {
                const domainFind = await sequelizedb2.transaction(async t=>{
                    return await Domain.findOne({
                        where:{
                            domainName:name
                        },
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
                    })
                })
                if(domainFind !== null){
                    domainFind.image = await sequelizedb1.transaction(async t =>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:domainFind.id,
                                nameTable:Domain.tableName
                            },
                            transaction:t
                        });
                        return picture?.urlPictures;
                    });
                    resolve({...domainFind?.dataValues , image: domainFind?.image} as Domain);
                }else resolve(domainFind);
            } catch (error) {
                reject(error);
            }
        })
    }

    findAllDomain(limit?:number  , search=''){
        return new Promise<{rows:DomainInterface[]; count:number;}>(async (resolve, reject) => {
            try {
                const tableDomain = await sequelizedb2.transaction(async t=>{
                    return await Domain.findAndCountAll({
                        where:{
                            domainName:{
                                [Op.like] : {
                                    [Op.any]:search?search.split('').map(chaine=>`%${chaine}%`):['']
                                }
                            }
                        },
                        limit,
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
                        },
                        order:[
                            [
                                sequelizedb2.getDialect() !== 'postgres'?
                                sequelizedb2.literal(`nbreSubscribe`):
                                sequelizedb2.literal(`"nbreSubscribe"`)
                                ,'DESC'
                            ]
                        ]
                    })
                })
                tableDomain.rows = await sequelizedb1.transaction(async t=>{
                    return await Promise.all(tableDomain.rows.map(async elts=>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:elts.id,
                                nameTable:Domain.tableName
                            },
                            transaction:t
                        });
                        elts.image = picture?.urlPictures;
                        return {...elts.dataValues, image: elts.image} as Domain;
                    }))
                })
                resolve(tableDomain);
            } catch (error) {
                reject(error);
            }
        })
    }

    followDomain(instance:DomainInterface,userIp?:string,userId?:number){
        return new Promise<[FollowDomainInterface,boolean]>(async (resolve, reject) => {
            try {
                const followData = await sequelizedb2.transaction(async t=>{
                    return await FollowDomain.findOrCreate({
                        where:{
                            domainId:instance.id,
                            userIp:userIp?userIp:null,
                            userId:userId?userId:null
                        },
                        defaults:{
                            userIp,
                            userId,
                            domainId:instance.id
                        }
                    })
                })
                resolve(followData);
            } catch (error) {
                reject(error);
            }
        })
    }

    deleteDomain(instance: Domain){
        return new Promise<void>(async(resolve, reject) => {
            try {
                await sequelizedb2.transaction(async t=>{
                    await Domain.destroy({where:{id:instance.id},force:true});
                })
                resolve();
            } catch (error) {
                reject(error)
            }
        })
    }
}

export default new DomaineService();
