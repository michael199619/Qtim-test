#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { Command } from 'commander';
import { existsSync } from 'fs';
import path,{ join } from 'path';
const nestJson=require('../nest-cli.json');

enum Action {
    GENERATE='migration:generate',
    RUN='migration:run',
    REVERT='migration:revert',
}

const services=Object.keys(nestJson.projects)
    .filter(service => nestJson.projects[service].root.includes('apps/microservice'));

async function runTypeOrm(action: Action,cwd: string,name: string='auto') {
    const pathToDataSource=join(cwd,'src','db','data-source.ts');
    const pathToMigration=join(cwd,'src','migrations');


    if (!existsSync(pathToDataSource)) {
        console.log(`Service <${pathToDataSource}> doesn't have a data-source.ts`);
        return;
    }

    let cmd='';

    if (action===Action.GENERATE) {
        cmd=`npx ts-node -r tsconfig-paths/register node_modules/typeorm/cli.js migration:generate ./${pathToMigration}/${name} -d ./${pathToDataSource}`;
    } else if (action===Action.RUN) {
        cmd=`npx ts-node -r tsconfig-paths/register node_modules/typeorm/cli.js migration:run -d ./${pathToDataSource}`;
    } else if (action===Action.REVERT) {
        cmd=`npx ts-node -r tsconfig-paths/register node_modules/typeorm/cli.js migration:revert -d ./${pathToDataSource}`;
    }

    console.log(`\n→ ${cmd}  (cwd: ${cwd})`);
    execSync(cmd,{ stdio: 'inherit',cwd: path.join(__dirname,'..') });
}

async function handler() {
    const { all,service,name }=this.opts() as { all?: boolean; service?: string; name?: string };
    const commandName=this.name() as Action;

    if (service&&!services.includes(service)) {
        console.error(`Invalid service "${service}". Use one of: ${services.join(', ')}`);
        process.exit(1);
    }

    if (all) {
        for (const t of services) {
            await runTypeOrm(commandName,nestJson.projects[t].root,name);
        }
    } else if (service) {
        await runTypeOrm(commandName,nestJson.projects[service].root,name);
    } else {
        this.help();
    }
}

const program=new Command();

program
    .name('typeorm-runner')
    .description('TypeORM migrations runner for microservices')
    .version('1.0.0');

program
    .command('migration:generate')
    .requiredOption('-n, --name <name>','Migration name')
    .option('-a, --all','Run for all microservices')
    .option('-s, --service <name>','Run for a specific service')
    .action(handler);

program
    .command('migration:run')
    .option('-a, --all','Run for all microservices')
    .option('-s, --service <name>','Run for a specific service')
    .action(handler);

program
    .command('migration:revert')
    .option('-a, --all','Run for all microservices')
    .option('-s, --service <name>','Run for a specific service')
    .action(handler);

program.parse();