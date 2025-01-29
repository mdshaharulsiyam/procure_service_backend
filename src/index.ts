import cluster from "cluster"
import os from 'os'
import { server } from "./socket";
import { logger } from "./utils/logger";


const numCPUs = os.cpus().length || 1;

// if (cluster.isPrimary) {
//     console.log(`primary process ${process.pid} running`)
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${worker.process.pid} exited. Restarting...`);
//         cluster.fork();
//     });
// } else {


function main() {
    server.listen(2300, async () => {
        logger.info('server is running')
    })
}

main()
// }
