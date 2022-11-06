import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {EventConfigs} from 'be-decorated/types';
import {Actions, VirtualProps, Proxy, PP, ProxyProps} from './types';
import {register} from 'be-hive/register.js';
import {ITx} from 'trans-render/lib/types';


export class BeCounted extends EventTarget implements Actions {

    
    
    hydrate(pp: PP): [Partial<PP>, EventConfigs<Proxy, Actions>] {
        const {self, incOn, min, incOff} = pp;
        if(incOff) return [{}, {}];  //clears event handler
        return [{
            value: min,
            resolved: true,
        },{
            inc: {
                on: incOn!,
                of: self,
                doInit: false,
            }
        }];
    }

    check({step, ltOrEq, lt, value}: PP){
        if(step! > 0){
            if(ltOrEq === undefined && lt === undefined) return {
                incOff: false,
                checked: true,
            };
            if(ltOrEq !== undefined){
                return {
                    incOff: step! + value > ltOrEq,
                    checked: true,
                } 
            }
            return {
                incOff: step! + value >= lt!,
                checked: true,
            }
        }
        return {
            incOff: false,
            checked: true,
        }
    }

    inc(pp: PP){
        let {value, step} = pp;
        return {
            value: value + step!,
        }
        
    }

    #tx: ITx | undefined;
    async tx(pp: PP){
        if(this.#tx === undefined){
            const {self, transformScope, proxy, transform} = pp;
            const {Tx} = await import('trans-render/lib/Tx.js');
            this.#tx = new Tx(proxy, self, transform!, transformScope!);
        }
        this.#tx.transform();
    }

    #txWhenMax: ITx | undefined;
    async txWhenMax(pp: PP){
        if(this.#txWhenMax === undefined){
            const {self, transformScope, proxy, transformWhenMax} = pp;
            const {Tx} = await import('trans-render/lib/Tx.js');
            this.#txWhenMax = new Tx(proxy, self, transformWhenMax!, transformScope!);
        }
        this.#txWhenMax.transform();
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
                'nudge', 'step', 'value', 'transform', 'transformScope', 'incOff', 'checked', 'transformWhenMax'
            ],
            nonDryProps: ['incOff', 'incOn'],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                checked: false,
                value: 0,
                transformScope: 'parent'
            },
            emitEvents: ['value'],
            //finale: 'finale'
        },
        actions:{
            check: {
                ifKeyIn: ['value']
            },
            hydrate: {
                ifAllOf: ['incOn', 'checked'],
                ifKeyIn: ['lt', 'ltOrEq', 'incOff']
            },
            tx:{
                ifAllOf: ['transform'],
                ifKeyIn: ['value']
            },
            txWhenMax:{
                ifAllOf: ['transformWhenMax', 'incOff']
            }
        }
    },
    complexPropDefaults:{
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
