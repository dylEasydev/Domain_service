import { DomainController } from '../controller/domain.controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class DomainRouter extends BaseRouter <DomainController>{
    public initRoute(){
        this.routerServeur.get('/',this.controllerService.findAllDomain);
        this.routerServeur.get('/:id',this.controllerService.findDomainById);
        this.routerServeur.get('/name/:domainName',this.controllerService.findDomainByName);

        this.routerServeur.put('/:id',auth.secureMiddleware,auth.verifPermToken('updated:domain'),this.controllerService.updateDomain);
        this.routerServeur.post('/',auth.secureMiddleware,auth.verifPermToken('created:domain'),this.controllerService.createDomain);
        this.routerServeur.post('/follow/:id',auth.verifTokenExist,this.controllerService.followDomain);
        
        this.routerServeur.delete('/:id',auth.secureMiddleware,auth.verifPermToken('deleted:domain'),this.controllerService.deleteDomain);
    }
}

export default new DomainRouter(new DomainController()).routerServeur;