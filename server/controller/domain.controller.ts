import { Request, Response} from 'express';
import { BaseController } from './base.controller';
import { Token } from '../db';
import { statusResponse,CodeStatut } from '../helper';
import { domainService } from '../db/service';
import { ValidationError } from 'sequelize';

export class DomainController extends BaseController{

    async createDomain(req:Request, res:Response){
        try{
            const userToken = req.body.token as Token
            if(typeof userToken.scope ==='string'){
                if(userToken.scope !== 'created:domain')
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de création de domaine !`
                    );
            }else if(typeof userToken.scope === 'undefined'){
                return statusResponse.sendResponseJson(
                    CodeStatut.NOT_PERMISSION_STATUS,
                    res,
                    `Aucune Permission de création de domaine !`
                );
            }else{
                if(!userToken.scope.includes('created:domain'))
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de création de domaine !`
                    );
            }

            const {domainName , domainDescript} = req.body;
            const newDomain = await domainService.createDomain({domainName, domainDescript});
            return statusResponse.sendResponseJson(
                CodeStatut.CREATE_STATUS,
                res,
                `Nouveau domaine ${newDomain.domainName} créer avec sucess !!`,
                newDomain
            );

        }catch(error){
            if(error instanceof ValidationError){
                return statusResponse.sendResponseJson(
                    CodeStatut.CLIENT_STATUS,
                    res,
                    error.message,
                    error
                );
            }

            return statusResponse.sendResponseJson(
                CodeStatut.SERVER_STATUS,
                res,
                `Erreur au niveau du serveur réesayer plus tard`,
                error
            );
        }
    }

    async updateDomain(req:Request ,res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'updated:domain')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de mis à jour d'un domaine !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de mis à jour d'un domaine !`
                    );
                }else{
                    if(!userToken.scope.includes('updated:domain'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de mis à jour d'un domaine !`
                        );
                }
                const id = isNaN(parseInt(req.params.id))?0:parseInt(req.params.id);
                const lastDomain= await domainService.findDomainById(id);
                if(lastDomain === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucun domain d'identifiant ${req.params.id}!`
                    );
                } 
                const {domainName , domainDescript} = req.body;
                const domainUpdate = await domainService.updateDomain(lastDomain,{domainDescript,domainName});
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Domaine ${domainUpdate.domainName} mis à jour avec succès !`,
                    domainUpdate
                );
            } catch (error) {
                if(error instanceof ValidationError){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        error.message,
                        error
                    );
                }
    
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur réesayer plus tard`,
                    error
                );
            }
        }
    }
    
    async findDomainByName(req:Request , res:Response){
        if(req.params.domainName){
            try {
                const domainFind = await domainService.findDomainByName(req.params.domainName);
                if(domainFind === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucun domain du noms ${req.params.domainName}!`
                    );
                } 
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    ` Domain ${domainFind.domainName} trouver avec sucess !!`,
                    domainFind
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

    async findDomainById(req:Request , res:Response){
        if(req.params.id){
            try {
                const id = isNaN(parseInt(req.params.id))?0:parseInt(req.params.id);
                const domainFind = await domainService.findDomainById(id);
                if( domainFind === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucun domain d'identifiant ${req.params.id}!`
                    );
                } 
                
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    ` Domain ${domainFind.domainName} trouver avec succès !`,
                    domainFind
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

    async findAllDomain(req:Request , res:Response){
        try {
            const limit = (typeof req.query.limit === 'string')? parseInt(req.query.limit ): undefined;
            if(req.query.search){
                const search = (typeof req.query.search === 'string')?req.query.search:'';
                if(search.length < 2){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        `vous devez donner au moins 2 carractères pour éffectuer la recherche!`
                    );
                }
                const tableDomain = await domainService.findAllDomain(limit , search);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Nous avons trouver ${tableDomain.count} résultats au terme de recherche ${search}!`,
                    tableDomain.rows
                );
            }
            const tableDomain = await domainService.findAllDomain(limit);
            return statusResponse.sendResponseJson(
                CodeStatut.VALID_STATUS,
                res,
                `Nous avons trouver ${tableDomain.count} domaines au totale !`,
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
    
    async followDomain(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token |undefined;
                const id = isNaN(parseInt(req.params.id))?0:parseInt(req.params.id);
                const domainFind = await domainService.findDomainById(id);
                if(domainFind === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucun domain d'identifiant ${req.params.id}!`
                    );
                }
                if(userToken) await domainService.followDomain(domainFind,undefined,userToken.userId);
                else await domainService.followDomain(domainFind,req.ip);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Vous suivez Bien le domaine ${domainFind.domainName}`
                );
            } catch (error) {
                if(error instanceof ValidationError){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        error.message,
                        error
                    );
                }
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur réesayer plus tard`,
                    error
                );
            }
        }
    }

    async deleteDomain(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'deleted:domain')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de supression d'un domain !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de supression d'un domaine !`
                    );
                }else{
                    if(!userToken.scope.includes('deleted:domain'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de supression d'un domaine !`
                        );
                }
                const id = isNaN(parseInt(req.params.id))?0:parseInt(req.params.id);
                const domainFind = await domainService.findDomainById(id);
                if(domainFind === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucun domain d'identifiant ${req.params.id}!`
                    );
                } 

                await domainService.deleteDomain(domainFind);
                
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Vous avez supprimer le domaine ${domainFind.domainName}`
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
