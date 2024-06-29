import cluster from 'node:cluster';
import { launchCluster } from './cluster'
import { launchHttpServer } from './server';
import { initDb } from './db/initdb';

const launchServer = (isRequiredClustering:Boolean)=>{
    initDb().then(()=>console.log(`synchronisation réussi`)).catch(error => console.log(`Error:${error}`));
    if(isRequiredClustering && cluster.isPrimary){
        launchCluster();
    }
    else{
        console.log(`${process.pid} is worker`);
        launchHttpServer();
    }
}

launchServer(false);