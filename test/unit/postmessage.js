const PostMessage = require('../../src/postmessage.js');

describe('PostMessage', () => {

    it('constructor', () => {
        const options = {foo: 'foo'};
        const p = new PostMessage(options);

        expect(p instanceof PostMessage).to.eql(true);
        expect(p.options.foo).to.eql('foo');
        expect(p.options.timeout).to.eql(2000);
    });
});