import { DomainInterface } from '../../interface';

export interface FollowDomainServiceInterface{
    findDomainFollow(userId:number,limit?:number):Promise<{count:number; rows:DomainInterface[];}>;
    deSubscribeDomain(userId:number , domainId:number):Promise<void>;
}