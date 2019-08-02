const chai = require('chai');
chai.should();
global.expect = chai.expect;

process.on('warning', (warning) => {
    if (warning.name === 'PromiseRejectionHandledWarning') {
        console.log(warning.stack);
    }
});

process.on('unhandledRejection', (rejection) => {
    throw rejection;
});