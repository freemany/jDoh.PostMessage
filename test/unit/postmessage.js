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
        const msg = {};
        msg[p.msgKey] = message;
        expect(result.message).to.eql(JSON.stringify(msg));
        expect(result.channel).to.eql(channel);
        expect(result.type).to.eql('ask');
    });

    it('_setMessage with object', () => {
        const message = {foo:'foo', bar:'bar'};
        const p = new PostMessage();

        expect(p._setMessage(message)).to.eql(JSON.stringify(message));
    });

    it('_setMessage with string', () => {
        const message = 'string';
        const p = new PostMessage();

        const expected = {};
        expected[p.msgKey] = message;
        const result = p._setMessage(message);

        expect(result).to.eql(JSON.stringify(expected));
    });

    it('_getMessage with object', () => {
        const p = new PostMessage();

        const message = 'message';
        const obj = {};
        obj[p.msgKey] = message;
        const result = JSON.stringify(obj);

        expect(p._getMessage(result)).to.eql(message);
    });

    it('_getMessage with object with invalid key', () => {
        const p = new PostMessage();

        const message = 'message';
        const obj = {};
        obj[p.msgKey] = message;
        obj.foo = 'foo';
        const result = JSON.stringify(obj);

        expect(p._getMessage(result)).to.eql(obj);
    });

    it('_getMessage with string', () => {
        const p = new PostMessage();

        const message = 'message';

        expect(p._getMessage(message)).to.eql(message);
    });
});