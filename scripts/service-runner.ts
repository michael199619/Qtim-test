#!/usr/bin/env node

import { execSync } from 'child_process';
import { Command } from 'commander';

const services: string[]=Object.keys(require('../nest-cli.json').projects);

const program=new Command();

program
    .name('service-runner')
    .description('Утилита для управления микросервисами')
    .version('1.0.0');

program
    .command('build <service>')
    .description('Собрать микрос')
    .action((service: string) => run('nest build',service));

program
    .command('start <service>')
    .description('Запустить микрос')
    .action((service: string) => run('nest start',service));

program
    .command('start:dev <service>')
    .description('Запустить микрос в дев режиме')
    .action((service: string) => run('nest start --watch',service));

program
    .command('start:all')
    .description('Запустить все микросервисы')
    .option('-d, --dev','Дев режим')
    .option('-f, --filter <pattern>','Фильтр по паттерну (например: micro-*)')
    .option('-e, --exclude <services>','Исключить сервисы (через запятую)')
    .option('--dry-run','Показать команду без выполнения')
    .action((options: {
        dev?: boolean;
        filter?: string;
        exclude?: string;
        dryRun?: boolean;
    }) => startAll(options));

program
    .command('list')
    .description('Показать список микросов')
    .action(() => {
        console.log('Доступные:');
        services.forEach((service,i) => console.log(`  ${i+1}. ${service}`));
    });

function run(command: string,service: string): void {
    if (!services.includes(service)) {
        console.error(`Сервис "${service}" не найден`);
        console.log('Доступные:',services.join(', '));
        process.exit(1);
    }

    // Перед сборкой/запуском любого сервиса собираем общую библиотеку
    try {
        console.log('npm --prefix apps/common run build');
        execSync('npm --prefix apps/common run build',{ stdio: 'inherit' });
    } catch (e) {
        console.error('Ошибка сборки common');
        throw e;
    }

    const fullCommand=`${command} ${service}`;
    console.log(fullCommand);
    execSync(fullCommand,{ stdio: 'inherit' });
}

function startAll(options: {
    dev?: boolean;
    filter?: string;
    exclude?: string;
    dryRun?: boolean;
}): void {
    let servs=[...services];

    // Фильтр
    if (options.filter) {
        const regex=new RegExp(options.filter.replace(/\*/g,'.*'));
        servs=servs.filter(s => regex.test(s));
        if (servs.length===0) {
            console.error(`Нет сервисов по паттерну: ${options.filter}`);
            process.exit(1);
        }
    }

    // Исключение
    if (options.exclude) {
        const excluded=options.exclude.split(',').map(s => s.trim());
        servs=servs.filter(s => !excluded.includes(s));
    }

    console.log(`Запуск:`);
    servs.forEach((s,i) => console.log(`  ${i+1}. ${s}`));

    // Перед массовым запуском собираем общую библиотеку
    try {
        console.log('npm --prefix apps/common run build');
        execSync('npm --prefix apps/common run build',{ stdio: 'inherit' });
    } catch (e) {
        console.error('Ошибка сборки common');
        throw e;
    }

    const baseCommand=options.dev? 'nest start --watch':'nest start';
    const commands=servs.map(s => `${baseCommand} ${s}`);
    const cmd=`concurrently ${commands.map(c => `"${c}"`).join(' ')}`;

    if (options.dryRun) {
        console.log(`\nDRY RUN: ${cmd}`);
        return;
    }

    console.log(`\n${cmd}`);
    execSync(cmd,{ stdio: 'inherit' });
}

program.parse();
