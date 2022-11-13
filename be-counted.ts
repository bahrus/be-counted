import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {EventConfigs} from 'be-decorated/types';
import {Actions, VirtualProps, Proxy, PP, ProxyProps, PA, PPE} from './types';
import {register} from 'be-hive/register.js';
import {ITx} from 'trans-render/lib/types';


export class BeCounted extends EventTarget implements Actions {

    hydrate(pp: PP): [Partial<PP>, EventConfigs<Proxy, Actions>] {
        const {self, incOn, min} = pp;
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
                isMaxed: false,
                checked: true,
            } as PA;
            if(ltOrEq !== undefined){
                return {
                    isMaxedOut: step! + value > ltOrEq,
                    checked: true,
                } as PA;
            }
            return {
                isMaxedOut: step! + value >= lt!,
                checked: true,
            } as PA;
        }
        return {
            isMaxedOut: false,
            checked: true,
        } as PA;
    }

    inc(pp: PP){
        let {value, step} = pp;
        return {
            value: value + step!,
        }
        
    }

    disableInc({self}: PP){
        return [, {
            'inc': {
                abort: {
                    origMethName: 'hydrate',
                    destMethName: 'inc',
                    of: self as EventTarget,
                    on: 'click'
                },
            }
        }] as PPE;
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
        this.#txWhenMax = undefined;
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
                'nudge', 'step', 'value', 'transform', 'transformScope', 'checked', 'transformWhenMax', 'isMaxedOut'
            ],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                checked: false,
                value: 0,
                transformScope: 'parent',
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
                ifKeyIn: ['lt', 'ltOrEq'],
                ifNoneOf: ['isMaxedOut']
            },
            disableInc: 'isMaxedOut',
            tx:{
                ifAllOf: ['transform'],
                ifKeyIn: ['value']
            },
            txWhenMax:{
                ifAllOf: ['transformWhenMax', 'isMaxedOut']
            }
        }
    },
    complexPropDefaults:{
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
