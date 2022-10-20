import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {EventConfigs} from 'be-decorated/types';
import {Actions, VirtualProps, Proxy, PP, ProxyProps} from './types';
import {register} from 'be-hive/register.js';
import {ITx} from 'trans-render/lib/types';


export class BeCounted extends EventTarget implements Actions {

    #tx: ITx | undefined;
    
    hydrate(pp: PP): [Partial<PP>, EventConfigs<Proxy, Actions>] {
        const {self, incOn, min} = pp;
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

    inc(pp: PP){
        let {value, step} = pp;
        value += step!;
        if(!this.check(pp)) {
            return {
                incOff: true,
                value
            }
        }else {
            return {
                value
            }
        }
    }

    async tx(pp: PP){
        if(this.#tx === undefined){
            const {self, transformScope, proxy} = pp;
            const {transform} = pp;
            const {Tx} = await import('trans-render/lib/Tx.js');
            this.#tx = new Tx(proxy, self, transform!, transformScope!);
        }
        this.#tx.transform();
    }

    finale(): void {
        this.#tx = undefined;
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
            nonDryProps: ['incOff', 'incOn'],
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
            hydrate: {
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
