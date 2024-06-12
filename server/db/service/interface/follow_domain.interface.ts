import { DomainInterface } from '../../interface';
import { FollowDomain } from '../../models';

export interface FollowDomainServiceInterface{
    findDomainFollow(userId:number,limit?:number):Promise<{count:number; rows:DomainInterface[];}>;
    findFollowDomain(userId:number, domainId:number):Promise<FollowDomain|null>;
    deSubscribeDomain(userId:number , domainId:number):Promise<void>;
}