'use strict';

const { apply,url,applyTemplates,move,mergeWith,chain,MergeStrategy }=require('@angular-devkit/schematics');
const core=require('@angular-devkit/core');
const inquirer=require('inquirer').default;
const strings=core.strings;
const { Project }=require('ts-morph');
const { join }=require('path');

function usecase(options) {
  return async function (tree,context) {
    options=options||{};
    const name=options.name||'';
    options.method=name; // Добавляем method для совместимости с шаблонами
    options.index=name; // Добавляем index для совместимости с шаблонами

    const rules=[];

    // Чтение nest-cli.json
    const config=JSON.parse(tree.read('/nest-cli.json').toString('utf-8'));
    const apies=[];
    const microses=[];

    Object.keys(config.projects).forEach(n => {
      const root=config.projects[n].root;
      if (root.includes('apps/microservice/')) microses.push(n);
      if (root.includes('apps/api/')) apies.push(n);
    });

    // Выбор micro
    const { entity }=await inquirer.prompt([
      { type: 'list',name: 'entity',message: 'Choose a micro:',choices: microses },
    ]);
    options.entity=entity;

    // Выбор controller и api
    let api,section;
    if (options.controller) {
      const resApi=await inquirer.prompt([
        { type: 'list',name: 'api',message: 'Choose a API:',choices: apies }
      ]);
      api=resApi.api;
      options.api=api;

      const resSection=await inquirer.prompt([
        { type: 'input',name: 'section',message: 'Name of section:' }
      ]);
      section=resSection.section;
      options.section=section;
    }

    // Добавляем дополнительные переменные для шаблонов
    options.methodClass=strings.classify(name);
    options.SectionClass=strings.classify(section);
    options.micro=strings.dasherize(entity);
    options.http='Post';

    // --- Microservice Usecase ---
    const micro=apply(url('./files/micro'),[
      applyTemplates({ ...strings,...options }),
      move(`apps/microservice/${strings.dasherize(entity)}/src/usecases/${strings.dasherize(name)}`),
    ]);
    rules.push(mergeWith(micro));
    context.logger.info(`📁 Micro usecase will be created at: apps/microservice/${strings.dasherize(entity)}/src/usecases/${strings.dasherize(name)}`);

    // ts-morph: update microservice app.module.ts
    rules.push((tree,context) => {
      const modulePath=`apps/microservice/${strings.dasherize(entity)}/src/app.module.ts`;
      if (!tree.exists(modulePath)) return tree;

      const project=new Project();
      const sourceFile=project.createSourceFile(modulePath,tree.read(modulePath).toString(),{ overwrite: true });

      const moduleName=`${strings.classify(name)}Module`;
      const importPath=`./usecases/${strings.dasherize(name)}/${strings.dasherize(name)}.module`;

      if (!sourceFile.getImportDeclarations().some(imp => imp.getModuleSpecifierValue()===importPath)) {
        sourceFile.addImportDeclaration({ namedImports: [moduleName],moduleSpecifier: importPath });
      }

      const moduleClass=sourceFile.getClass(c => c.getName()!==undefined);
      const moduleDecorator=moduleClass?.getDecorator('Module');
      if (moduleDecorator) {
        const objLiteral=moduleDecorator.getArguments()[0];
        const importsProp=objLiteral.getProperty('imports');
        if (importsProp) {
          const initializer=importsProp.getInitializer();
          if (initializer&&!initializer.getText().includes(moduleName)) {
            // Используем ts-morph для правильного добавления элемента в массив
            if (initializer.getKind()===205) { // ArrayLiteralExpression
              const arrayExpression=initializer.asKindOrThrow(205);
              // Добавляем модуль в конец массива
              arrayExpression.addElement(moduleName);
            }
          }
        }
      }

      sourceFile.saveSync();
      tree.overwrite(modulePath,sourceFile.getFullText());
      context.logger.info(`✅ Module ${moduleName} registered in microservice app.module.ts`);
      return tree;
    });

    // ts-morph: update microservice app.controller.ts
    rules.push((tree,context) => {
      const controllerPath=`apps/microservice/${strings.dasherize(entity)}/src/app.controller.ts`;
      if (!tree.exists(controllerPath)) return tree;

      const project=new Project();
      const sourceFile=project.createSourceFile(controllerPath,tree.read(controllerPath).toString(),{ overwrite: true });

      const usecaseName=`${strings.classify(name)}Usecase`;
      const importPath=`./usecases/${strings.dasherize(name)}/${strings.dasherize(name)}.usecase`;

      if (!sourceFile.getImportDeclarations().some(imp => imp.getModuleSpecifierValue()===importPath)) {
        sourceFile.addImportDeclaration({ namedImports: [usecaseName],moduleSpecifier: importPath });
      }

      const controllerClass=sourceFile.getClass(c => c.getName()!==undefined);
      if (controllerClass) {
        const constructor=controllerClass.getConstructors()[0];
        if (constructor) {
          const methodName=strings.camelize(name);
          const usecasePropertyName=`${strings.camelize(name)}Usecase`;

          // Добавляем usecase в конструктор
          if (!constructor.getParameters().some(p => p.getName()===usecasePropertyName)) {
            constructor.addParameter({
              name: usecasePropertyName,
              type: usecaseName,
              scope: 'private',
              isReadonly: true,
              leadingTrivia: '\n    '
            });
          }

          // Добавляем метод
          if (!controllerClass.getMethod(methodName)) {
            controllerClass.addMethod({
              name: methodName,
              returnType: 'Promise<any>',
              statements: [`return this.${usecasePropertyName}.execute();`]
            });
          }
        }
      }

      sourceFile.saveSync();
      tree.overwrite(controllerPath,sourceFile.getFullText());
      context.logger.info(`✅ Method ${strings.camelize(name)} added to microservice app.controller.ts`);
      return tree;
    });

    // --- Common DTO/Response ---
    if (options.common) {
      const common=apply(url('./files/common'),[
        applyTemplates({ ...strings,...options }),
        move(`apps/common/src/transport/${strings.dasherize(entity)}/dtos/${strings.dasherize(name)}`),
      ]);
      rules.push(mergeWith(common));
      context.logger.info(`📁 Common DTOs will be created at: apps/common/src/transport/${strings.dasherize(entity)}/dtos/${strings.dasherize(name)}`);

      // ts-morph: update dtos/index.ts
      rules.push(tree => {
        const indexPath=`apps/common/src/transport/${strings.dasherize(entity)}/dtos/index.ts`;
        const project=new Project();
        if (!tree.exists(indexPath)) tree.create(indexPath,'');
        const sourceFile=project.createSourceFile(indexPath,tree.read(indexPath)?.toString()||'',{ overwrite: true });

        const exportLine=`export * from './${strings.dasherize(name)}';`;
        if (!sourceFile.getText().includes(exportLine)) {
          sourceFile.insertText(sourceFile.getFullWidth(),`\n${exportLine}\n`);
          sourceFile.saveSync();
          tree.overwrite(indexPath,sourceFile.getFullText());
        }
        return tree;
      });

      // ts-morph: update interface
      rules.push(tree => {
        const ifacePath=`apps/common/src/transport/${strings.dasherize(entity)}/${strings.dasherize(entity)}.interface.ts`;
        if (!tree.exists(ifacePath)) return tree;

        const project=new Project();
        const sourceFile=project.createSourceFile(ifacePath,tree.read(ifacePath).toString(),{ overwrite: true });

        const iface=sourceFile.getInterface(i => i.getName()===`${strings.classify(entity)}Controller`);
        if (iface) {
          const methodName=strings.camelize(name);
          if (!iface.getMethod(methodName)) {
            iface.addMethod({
              name: methodName,
              parameters: [{ name: 'dto',type: `${strings.classify(name)}Dto` }],
              returnType: `${strings.classify(name)}Response`,
            });
          }
        }

        sourceFile.saveSync();
        tree.overwrite(ifacePath,sourceFile.getFullText());
        return tree;
      });

      // Создание интерфейса для метода
      const interfaceFile=apply(url('./files/common/__method__.interface.ts.template'),[
        applyTemplates({ ...strings,...options }),
        move(`apps/common/src/transport/${strings.dasherize(entity)}/${strings.dasherize(name)}.interface.ts`),
      ]);
      rules.push(mergeWith(interfaceFile));
    }

    // --- API Controller ---
    if (options.controller) {
      // ts-morph: create or update controller
      rules.push((tree,context) => {
        const controllerPath=`apps/api/${strings.dasherize(api)}/src/sections/${strings.dasherize(section)}/${strings.dasherize(section)}.controller.ts`;
        const modulePath=`apps/api/${strings.dasherize(api)}/src/sections/${strings.dasherize(section)}/${strings.dasherize(section)}.module.ts`;

        const project=new Project();

        // Создаем или обновляем контроллер
        if (!tree.exists(controllerPath)) {
          // Создаем новый контроллер
          const controllerContent=`import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ${strings.classify(name)}Dto, ${strings.classify(name)}Response } from '@test/common';

@Controller('${strings.dasherize(section)}')
export class ${strings.classify(section)}Controller {
  constructor() {}

  @Post('${strings.camelize(name)}')
  @ApiOperation({ description: '${strings.camelize(name)} operation' })
  @ApiResponse({ type: ${strings.classify(name)}Response })
  ${strings.camelize(name)}(@Body() dto: ${strings.classify(name)}Dto): ${strings.classify(name)}Response {
    return { success: true, data: dto };
  }
}`;
          tree.create(controllerPath,controllerContent);
        } else {
          // Обновляем существующий контроллер
          const sourceFile=project.createSourceFile(controllerPath,tree.read(controllerPath).toString(),{ overwrite: true });

          const methodName=strings.camelize(name);
          const controllerClass=sourceFile.getClass(c => c.getName()!==undefined);

          if (controllerClass&&!controllerClass.getMethod(methodName)) {
            // Добавляем новый метод в существующий контроллер
            controllerClass.addMethod({
              name: methodName,
              parameters: [{ name: 'dto',type: `${strings.classify(name)}Dto` }],
              returnType: `${strings.classify(name)}Response`,
              decorators: [
                { name: 'Post',arguments: [`'${methodName}'`] },
                { name: 'ApiOperation',arguments: [`{ description: '${methodName} operation' }`] },
                { name: 'ApiResponse',arguments: [`{ type: ${strings.classify(name)}Response }`] }
              ],
              statements: [`return { success: true, data: dto };`]
            });

            // Добавляем импорты если их нет
            const dtoImport=`import { ${strings.classify(name)}Dto } from '@test/common';`;
            const responseImport=`import { ${strings.classify(name)}Response } from '@test/common';`;
            const apiImports=`import { ApiOperation, ApiResponse } from '@nestjs/swagger';`;

            if (!sourceFile.getText().includes(dtoImport)) {
              sourceFile.insertText(0,`${dtoImport}\n`);
            }
            if (!sourceFile.getText().includes(responseImport)) {
              sourceFile.insertText(0,`${responseImport}\n`);
            }
            if (!sourceFile.getText().includes('ApiOperation')) {
              sourceFile.insertText(0,`${apiImports}\n`);
            }
          }

          sourceFile.saveSync();
          tree.overwrite(controllerPath,sourceFile.getFullText());
          context.logger.info(`✅ Method ${methodName} added to existing controller`);
        }

        // Создаем или обновляем модуль
        if (!tree.exists(modulePath)) {
          const moduleContent=`import { Module } from '@nestjs/common';
import { ${strings.classify(section)}Controller } from './${strings.dasherize(section)}.controller';

@Module({
  controllers: [${strings.classify(section)}Controller],
  exports: [${strings.classify(section)}Controller],
})
export class ${strings.classify(section)}Module {}`;
          tree.create(modulePath,moduleContent);
        }

        return tree;
      });

      // ts-morph: update app.module.ts
      rules.push((tree,context) => {
        const modulePath=`apps/api/${strings.dasherize(api)}/src/app.module.ts`;
        if (!tree.exists(modulePath)) return tree;

        const project=new Project();
        const sourceFile=project.createSourceFile(modulePath,tree.read(modulePath).toString(),{ overwrite: true });

        const moduleName=`${strings.classify(section)}Module`;
        const importPath=`./sections/${strings.dasherize(section)}/${strings.dasherize(section)}.module`;

        if (!sourceFile.getImportDeclarations().some(imp => imp.getModuleSpecifierValue()===importPath)) {
          sourceFile.addImportDeclaration({ namedImports: [moduleName],moduleSpecifier: importPath });
        }

        const moduleClass=sourceFile.getClass(c => c.getName()!==undefined);
        const moduleDecorator=moduleClass?.getDecorator('Module');
        if (moduleDecorator) {
          const objLiteral=moduleDecorator.getArguments()[0];
          const importsProp=objLiteral.getProperty('imports');
          if (importsProp) {
            const initializer=importsProp.getInitializer();
            if (initializer&&!initializer.getText().includes(moduleName)) {
              // Используем ts-morph для правильного добавления элемента в массив
              if (initializer.getKind()===205) { // ArrayLiteralExpression
                const arrayExpression=initializer.asKindOrThrow(205);
                // Добавляем модуль в конец массива
                arrayExpression.addElement(moduleName);
              }
            }
          }
        }

        sourceFile.saveSync();
        tree.overwrite(modulePath,sourceFile.getFullText());
        context.logger.info(`✅ Module ${moduleName} registered in app.module.ts`);
        return tree;
      });
    }

    context.logger.info(`✔️ Usecase '${name}' for entity '${entity}' generated${options.controller? ' with controller':''}.`);
    return chain(rules);
  };
}

module.exports={ usecase };