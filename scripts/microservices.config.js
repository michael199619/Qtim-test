const nestJson = require('../nest-cli.json')

module.exports = {
    services: Object.keys(nestJson.projects),

    getBuildScripts() {
        return this.services.reduce((scripts, service) => {
            scripts[`build:${service}`] = `nest build ${service}`;
            return scripts;
        }, {});
    },

    getStartScripts() {
        return this.services.reduce((scripts, service) => {
            scripts[`start:${service}`] = `nest start ${service}`;
            return scripts;
        }, {});
    },

    getDevScripts() {
        return this.services.reduce((scripts, service) => {
            scripts[`start:dev:${service}`] = `nest start ${service} --watch`;
            return scripts;
        }, {});
    },

    getStartAllDevScript() {
        const devCommands = this.services.map(service => `npm run start:dev:${service}`);
        return `concurrently ${devCommands.map(cmd => `"${cmd}"`).join(' ')}`;
    }
};
