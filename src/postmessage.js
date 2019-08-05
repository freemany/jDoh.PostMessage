class PostMesssge {
    constructor(opts) {
        this.defaults = {timeout: 2000};
        this.options = Object.assign(this.defaults, opts);
        this.sendToken = null;
        this.onToken = null;
        this.channel = null;
        this.onCallback = () => {};
        this.SendCallback = () => {};
        this.errOnCallback = () => {};
        this.errSendCallback = () => {};
        this.status = null;
        this.window = null;
    }

    setWidow(window) {
        this.window = window;
    }

    _getWindow() {
        if (null === this.window) {
            return window;
        }

        return this.window;
    }

    on(channel, callback) {
        this.onCallback = callback;
        this.channel = channel;
        this._getWindow().addEventListener('message', this._onChannel.bind(this), true);

        return this;
    }

    response(msg) {
        this.options.target.postMessage(JSON.stringify({
            token: this.onToken,
            channel: this.channel,
            message: msg,
            type: 'answer',
        }), this.options.targetDomain)
    }

    _onChannel(e) {
        if (e.origin !== this.options.targetDomain) {
            return;
        }

        const response = JSON.parse(e.data);

        if (response.channel !== this.channel) {
            return;
        }
        if (response.type === 'answer') {
            return;
        }

        this.onToken = response.token;

        this.onCallback(response.message, this.response.bind(this));
    }

    _onReceive(e) {
        if (e.origin !== this.options.targetDomain) {
            return;
        }

        const response = JSON.parse(e.data);

        if (response.token !== this.sendToken || response.channel !== this.options.channel) {
            return;
        }

        this.status = '__responsed__';

        if (response.error) {
            this.errSendCallback({message: response.message, code: 'RESPONSE'});
            return;
        }

        this.sendCallback(response.message);
    }

    send(message, callback, errCallback) {
        this.sendCallback = callback;
        this.errSendCallback = errCallback;
        this.sendToken = 't' + Math.random();
        this.status = '__sending__';

        const onFunc = this._onReceive.bind(this);
        this._getWindow().addEventListener('message', onFunc, true);
        setTimeout(() => {
            window.removeEventListener('message', onFunc, true);
            if ('__responsed__' === this.status) {
                return;
            }
            this.errSendCallback({
                code: 'TIMEOUT',
                message: 'Timeout in ' + this.options.timeout,
            });
        }, this.options.timeout);

        const msg = {
            channel: this.options.channel,
            message: message,
            token: this.sendToken,
            type:'ask',
        };

        return this.options.target.postMessage(JSON.stringify(msg), this.options.targetDomain);
    }
}

module.exports = PostMesssge;