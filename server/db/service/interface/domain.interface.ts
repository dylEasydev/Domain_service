import { DomainInterface, FollowDomainInterface } from '../../interface';

export interface DomainInterfaceService{
    createDomain<
        T extends {domainName:string; domainDescript?:string;}
    >(value:T):Promise<DomainInterface>;

    updateDomain<
        T extends {domainName?:string; }
     >(instance:DomainInterface , value:T):Promise<DomainInterface>;

    findDomainById(id:number):Promise<DomainInterface|null>;
    findDomainByName(name:string):Promise<DomainInterface|null>;
    findAllDomain(limit?:number  , search? : string):Promise<{rows:DomainInterface[]; count:number;}>;

    followDomain(instance:DomainInterface,userIP?:string,userId?:number):Promise<[FollowDomainInterface,boolean]>;
    
    deleteDomain(instance:DomainInterface):Promise<void>;
}