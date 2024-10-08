import { FollowDomainController } from '../controller/follow_domain.controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class FollowDomainRouter extends BaseRouter<FollowDomainController>{
    public initRoute(){
        this.routerServeur.get('/',auth.verifTokenExist,this.controllerService.findFollowUser);
        this.routerServeur.delete('/deSubscribe/:id',auth.verifTokenExist,this.controllerService.desSubscribeDomain);
    }
} 

export default new FollowDomainRouter(new FollowDomainController()).routerServeur;