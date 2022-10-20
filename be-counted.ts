import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {EventConfigs} from 'be-decorated/types';
import {Actions, VirtualProps, Proxy, PP, ProxyProps} from './types';
import {register} from 'be-hive/register.js';
import {ITx} from 'trans-render/lib/types';


export class BeCounted extends EventTarget implements Actions {

    #abortController: AbortController | undefined;
    #tx: ITx | undefined;
    
    onIncOn(pp: PP): [Partial<PP>, EventConfigs<Proxy, Actions>] | void {
        const {self, incOn, proxy, min} = pp;
        if(!this.check(pp)) return [{}, {}];  //clears event handler
        return [{
            value: min,
            resolved: true,
        },{
            [incOn!]: {
                observe: self,
                action: 'do',
                doInit: false,
            }
        }];
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
        const {proxy, step, transform} = pp;
        proxy.value += step!;
        if(transform !== undefined){
            const {self, transformScope} = pp;
            if(this.#tx === undefined){
                const {Tx} = await import('trans-render/lib/Tx.js');
                this.#tx = new Tx(proxy, self, transform, transformScope!);
            }
            this.#tx.transform();
        }
        if(!this.check(pp)) {
            return{
                incOff: true
            }
        }
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
                'nudge', 'step', 'value', 'transform', 'transformScope', 'incOff'
            ],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                value: 0,
                transformScope: 'parent'
            },
            emitEvents: ['value'],
            //finale: 'finale'
        },
        actions:{
            onIncOn: {
                ifAllOf: ['incOn'],
                ifKeyIn: ['lt', 'ltOrEq', 'incOff']
            }
        }
    },
    complexPropDefaults:{
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
