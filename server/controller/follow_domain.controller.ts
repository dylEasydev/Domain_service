import { Request ,Response} from 'express';
import { BaseController } from './base.controller';
import { statusResponse, CodeStatut } from '../helper';
import { Token } from '../db';
import { follow_domainService ,domainService} from '../db/service';

export class FollowDomainController extends BaseController{

    async findFollowUser(req:Request, res:Response){
        try {
            const limit = req.query.limit? parseInt(req.query.limit as string) : undefined;
            const userToken = req.body.token as Token |undefined;
            if(req.query.search){
                const search = (typeof req.query.search === 'string')?req.query.search : '';
                if(search.length < 2){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        `vous devez donner au moins 2 carractères pour éffectuer la recherche!`
                    );
                }
                let tableDomain;
                if(userToken) tableDomain = await follow_domainService.findDomainFollow(undefined,userToken.userId, limit , search);
                else tableDomain = await follow_domainService.findDomainFollow(req.ip,undefined,limit,search);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Vous suivez ${tableDomain?.count} domaine(s) !!`,
                    tableDomain.rows
                );
            }
            let tableDomain;
            if(userToken) tableDomain = await follow_domainService.findDomainFollow(undefined,userToken.userId, limit);
            else tableDomain = await follow_domainService.findDomainFollow(req.ip,undefined,limit);
            
            return statusResponse.sendResponseJson(
                CodeStatut.VALID_STATUS,
                res,
                `Vous suivez ${tableDomain?.count} domaine(s) !!`,
                tableDomain.rows
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
                const userToken = req.body.token as Token |undefined
                const id = isNaN(parseInt(req.params.id))?0:parseInt(req.params.id);
                const domainFind = await domainService.findDomainById(id);
                if(domainFind === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucun domain d'identifiant ${req.params.id}!`
                    );
                }
                
                if(userToken) await follow_domainService.deSubscribeDomain(parseInt(req.params.id),undefined,userToken.userId);
                else await follow_domainService.deSubscribeDomain(parseInt(req.params.id),req.ip);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Vous êtes désabonnée avec success !!`,
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
