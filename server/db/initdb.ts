import { Domain, FollowDomain, Image, sequelizedb1, sequelizedb2 } from '../db'

export function initDb(){
    return new Promise<void>(async (resolve, reject) => {
        const test = process.env.NODE_ENV === 'developemnent';
        try {
            await sequelizedb1.authenticate();
            await sequelizedb2.authenticate();
            await Domain.sync({alter:test});
            await FollowDomain.sync({alter:test});
            await Image.sync({alter:test});
            await sequelizedb1.sync({alter:test});
            await sequelizedb2.sync({alter:test});
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}