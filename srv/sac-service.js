
const cds = require('@sap/cds');
const sacHandler = require('./handlers/consumers/sacHandler');


module.exports = cds.service.impl((srv) => {

    srv.after('READ', sacHandler.handleAfterRead);

});
