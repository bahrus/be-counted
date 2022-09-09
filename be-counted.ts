import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {Actions, VirtualProps, Proxy, PP, ProxyProps} from './types';
import {register} from 'be-hive/register.js';

export class BeCounted extends EventTarget implements Actions {

    #abortController: AbortController | undefined;
    onIncOn(pp: ProxyProps): void {
        this.disconnect();
        const {self, incOn} = pp;
        self.addEventListener(incOn!, e => {
            this.do(pp);
        }, {signal: this.#abortController?.signal});
    }

    do(pp: PP){

    }

    disconnect(){
        if(this.#abortController !== undefined){
            this.#abortController.abort();
        }
    }

    finale(proxy: Proxy, self: Element, beDecor: BeDecoratedProps<any, any>): void {
        this.disconnect();
    }
}

const tagName = 'be-counted';
const ifWantsToBe = 'counted';
const upgrade = '*';

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click'
            },
            finale: 'finale'
        },
    },
    complexPropDefaults:{
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
