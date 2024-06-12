import {sequelizedb1 ,sequelizedb2} from './config';
import {Image} from './init';
import { FollowDomain} from './associations';
import {Domain} from './hooks'
import { User , Token} from './interface';

export {
    sequelizedb1 , sequelizedb2,Image,
    FollowDomain,Domain,User,Token
};
