import { DomainInterface } from '../../interface';

export interface FollowDomainServiceInterface{
    findDomainFollow(userIp?:string,userId?:number,limit?:number):Promise<{count:number; rows:DomainInterface[];}>;
    deSubscribeDomain(domainId:number,userIp?:string ,userId?:number ):Promise<void>;
}