import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {EventConfigs} from 'be-decorated/types';
import {Actions, VirtualProps, Proxy, PP, ProxyProps} from './types';
import {register} from 'be-hive/register.js';
import {ITx} from 'trans-render/lib/types';


export class BeCounted extends EventTarget implements Actions {

    #abortController: AbortController | undefined;
    #tx: ITx | undefined;
    
    doIncOn(pp: PP): [Partial<PP>, EventConfigs<Proxy, Actions>] | void {
        const {self, incOn, proxy, min} = pp;
        if(!this.check(pp)) return [{}, {}];  //clears event handler
        return [{
            value: min,
            resolved: true,
        },{
            [incOn!]: {
                observe: self,
                action: 'inc',
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

    async inc(pp: PP){
        const {proxy, step, transform} = pp;
        proxy.value += step!;
        if(!this.check(pp)) {
            return{
                incOff: true
            }
        }
    }

    async tx(pp: PP){
        const {self, transformScope, proxy} = pp;
        if(this.#tx === undefined){
            const {transform} = pp;
            const {Tx} = await import('trans-render/lib/Tx.js');
            this.#tx = new Tx(proxy, self, transform!, transformScope!);
        }
        this.#tx.transform();
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
            doIncOn: {
                ifAllOf: ['incOn'],
                ifKeyIn: ['lt', 'ltOrEq', 'incOff']
            },
            tx:{
                ifAllOf: ['transform'],
                ifKeyIn: ['value']
            }
        }
    },
    complexPropDefaults:{
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
