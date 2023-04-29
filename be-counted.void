import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {EventConfigs} from 'be-decorated/types';
import {Actions, VirtualProps, Proxy, PP, ProxyProps, PA, PPE} from './types';
import {register} from 'be-hive/register.js';
import {ITx} from 'trans-render/lib/types';
import {inject} from 'be-decorated/inject.js';
export class BeCounted extends EventTarget implements Actions {

    async hydrate(pp: PP, mold: PPE): Promise<PPE> {
        const {self, incOn, min: value, nudge} = pp;
        if(nudge){
            const {nudge: n} = await import('trans-render/lib/nudge.js');
            n(self);
        }

        return inject<PPE>({
            mold,
            tbdSlots: {
                on: incOn, 
                of: self
            }
        });
    }

    check({step, ltOrEq, lt, value}: PP, mold: PA): PA{
        if(step! > 0){
            if(ltOrEq === undefined && lt === undefined) return mold;
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
        return mold;
    }

    inc(pp: PP){
        let {value, step} = pp;
        return {
            value: value + step!,
        }
        
    }

    disableInc({self}: PP, mold: PPE): PPE{
        return inject({
            mold,
            tbdSlots: {
                of: self
            }
        })
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
        },
        actions:{
            check: {
                ifKeyIn: ['value'],
                returnObjMold: {
                    isMaxedOut: false,
                    checked: true,
                }
            },
            hydrate: {
                ifAllOf: ['incOn', 'checked'],
                ifKeyIn: ['lt', 'ltOrEq'],
                ifNoneOf: ['isMaxedOut'],
                returnObjMold: [{
                    value: 0,
                    resolved: true,
                },{
                    inc: {
                        on: 'tbd',
                        of: 'tbd',
                        doInit: false,
                    }
                }]
            },
            disableInc: {
                ifAllOf: ['isMaxedOut'],
                returnObjMold: [, {
                    'inc': {
                        abort: {
                            origMethName: 'hydrate',
                            of: 'tbd',
                            on: 'click'
                        },
                    }
                }]
            },
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
