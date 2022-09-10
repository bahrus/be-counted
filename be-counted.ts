import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {Actions, VirtualProps, Proxy, PP, ProxyProps} from './types';
import {register} from 'be-hive/register.js';

export class BeCounted extends EventTarget implements Actions {

    #abortController: AbortController | undefined;
    onIncOn(pp: ProxyProps): void {
        const {self, incOn, proxy, min} = pp;
        proxy.resolved = true;
        this.disconnect();
        if(!this.check(pp)) return;
        proxy.value = min!;
        self.addEventListener(incOn!, e => {
            this.do(pp);
        }, {signal: this.#abortController?.signal});
    }

    check({step, ltOrEq, lt, value}: PP){
        if(step! > 0){
            if(ltOrEq === undefined && lt === undefined) return true;
            if(ltOrEq !== undefined){
                return step! + value <= ltOrEq;
            }
            return step! + value < lt!;
        }
    }

    do(pp: PP){
        const {proxy, step, value, ltOrEq, lt} = pp;
        proxy.value += step!;
        console.log({value: proxy.value});
        if(!this.check(pp)) {
            this.disconnect();
        }
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
            virtualProps: ['incOn', 'incOnSet', 'loop', 'lt', 'ltOrEq', 'min', 'nudge', 'step', 'value'],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                value: 0,
            },
            finale: 'finale'
        },
        actions:{
            onIncOn: {
                ifAllOf: ['incOn'],
                ifKeyIn: ['lt', 'ltOrEq']
            }
        }
    },
    complexPropDefaults:{
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
