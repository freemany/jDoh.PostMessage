const PostMessage = require('../../src/postmessage.js');

describe('PostMessage', () => {

    it('constructor', () => {
        const options = {foo: 'foo'};
        const p = new PostMessage(options);

        expect(p instanceof PostMessage).to.eql(true);
        expect(p.options.foo).to.eql('foo');
        expect(p.options.timeout).to.eql(2000);
    });

    it('send', () => {
        const channel = 'channel';
        const message = 'message';

        const options = {
            channel: channel,
            target: {
                postMessage: (json) => {
                    return JSON.parse(json);
                },
            }
        };
        const p = new PostMessage(options);
        p.setWidow({
            addEventListener: () => {},
            removeEventListener: () => {},
        });

        const result = p.send(message);
        expect(result.message).to.eql(message);
        expect(result.channel).to.eql(channel);
        expect(result.type).to.eql('ask');
    });
});