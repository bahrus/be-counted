import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {Actions, VirtualProps, Proxy, PP, ProxyProps} from './types';
import {register} from 'be-hive/register.js';
import { RenderContext } from './node_modules/trans-render/lib/types';

export class BeCounted extends EventTarget implements Actions {

    #abortController: AbortController | undefined;
    #ctx: RenderContext | undefined;
    onIncOn(pp: ProxyProps): void {
        const {self, incOn, proxy, min} = pp;
        proxy.resolved = true;
        this.disconnect();
        if(!this.check(pp)) return;
        proxy.value = min!;
        self.addEventListener(incOn!, async e => {
            await this.do(pp);
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

    async do(pp: PP){
        const {proxy, step, value, ltOrEq, lt, transform, self} = pp;
        proxy.value += step!;
        if(transform !== undefined){
            if(this.#ctx === undefined){
                
                this.#ctx = {
                    match: transform,
                    host: proxy as any as HTMLElement,
                };
            }
            // const target = pram.transformFromClosest !== undefined ?
            //     proxy.closest(pram.transformFromClosest)
            //     : host.shadowRoot || host!;
            const {getHost} = await import('trans-render/lib/getHost.js');
            const host = (getHost(proxy, true) || document) as HTMLElement;
            const target = host!.shadowRoot || host!;
            const {DTR} = await import('trans-render/lib/DTR.js');
            await DTR.transform(target, this.#ctx);

            this.#ctx.initiator = self;
        }
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

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            virtualProps: [
                'incOn', 'incOnSet', 'loop', 'lt', 'ltOrEq', 'min', 
                'nudge', 'step', 'value', 'transform'
            ],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                value: 0,
            },
            emitEvents: ['value'],
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
