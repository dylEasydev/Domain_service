import { Request ,Response} from 'express';
import { BaseController } from './base.controller';
import { statusResponse, CodeStatut } from '../helper';
import { Token } from '../db';
import { follow_domainService ,domainService} from '../db/service';

export class FollowDomainController extends BaseController{

    async findFollowUser(req:Request, res:Response){
        try {
            const limit = req.query.limit? parseInt(req.query.limit as string) : 5;
            const userToken = req.body.token as Token;
            const tableDomain =  await follow_domainService.findDomainFollow(userToken.userId, limit);
            return statusResponse.sendResponseJson(
                CodeStatut.VALID_STATUS,
                res,
                `Vos domaine suivie sont présent !!`,
                tableDomain
            );
        } catch (error) {
            return statusResponse.sendResponseJson(
                CodeStatut.SERVER_STATUS,
                res,
                `Erreur au niveau du serveur réesayer plus tard`,
                error
            );
        }    
    }
    
    async desSubscribeDomain(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'deSubscribed:domain')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de désabonnement à un domaine !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de désabonnement à un domaine  !`
                    );
                }else{
                    if(!userToken.scope.includes('deSubscribed:domain'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de désabonnement à un domaine !`
                        );
                }
                const domainFind = await domainService.findDomainById(parseInt(req.params.id));
                if(domainFind === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucun domain d'identifiant ${req.params.id}!`
                    );
                }
                
                await follow_domainService.deSubscribeDomain(userToken.userId , parseInt(req.params.id));
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Vous êtes deexesabonnée avec success !!`,
                );
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur réesayer plus tard`,
                    error
                );
            }
        }
    }
}