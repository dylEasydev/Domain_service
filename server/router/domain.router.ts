import { DomainController } from '../controller/domain.controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class DomainRouter extends BaseRouter <DomainController>{
    public initRoute(){
        this.routerServeur.get('/',this.controllerService.findAllDomain);
        this.routerServeur.get('/:id',this.controllerService.findDomainById);
        this.routerServeur.get('/:domaineName',this.controllerService.findDomainByName);

        this.routerServeur.put('/:id',auth.secureMiddleware,this.controllerService.updateDomain);

        this.routerServeur.post('/',auth.secureMiddleware,this.controllerService.createDomain);
        this.routerServeur.post('/follow/:id',auth.secureMiddleware,this.controllerService.followDomain);
        
        this.routerServeur.delete('/:id',auth.secureMiddleware,this.controllerService.deleteDomain);
    }
}

export default new DomainRouter(new DomainController()).routerServeur;