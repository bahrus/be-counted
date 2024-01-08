import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, ProPOA, POA} from './types';

export class BeCounted extends BE<AP, Actions> implements Actions{

    static  override get beConfig(){
        return {
            parse: true,
            isParsedProp: 'isParsed'
        } as BEConfig
    }

    check(self: this, allGood: PAP): PAP{
        const {step, ltOrEq, lt, value} = self;
        if(step! > 0){
            if(ltOrEq === undefined && lt === undefined) return allGood;
            if(ltOrEq !== undefined){
                return {
                    isMaxedOut: step! + value > ltOrEq,
                    checked: true,
                } as PAP;
            }
            return {
                isMaxedOut: step! + value >= lt!,
                checked: true,
            } as PAP;
        }
        return allGood;
    }

    async hydrate(self: this, mold: PAP): ProPOA {
        const {enhancedElement, incOn, min, nudge, transform} = self;
        if(nudge){
            const {nudge: n} = await import('trans-render/lib/nudge.js');
            n(self);
        }
        return [{
            resolved: transform === undefined,
            value: min,
        }, {
            inc: {
                on: incOn,
                of: enhancedElement
            }
        }] as POA
    }

    inc(self: this): PAP {
        const {value, step} = self;
        return {
            value: value + step!,
        }
    }

    disableInc(self: this): POA {
        const {enhancedElement, incOn} = self;
        return [,{
        
            inc: {
                abort: {
                    origMethName: 'hydrate',
                    on: incOn!,
                    of: enhancedElement
                }
            }
        }]
    }

    // #tx: ITx | undefined;
    // async tx(self: this){
    //     if(this.#tx === undefined){
    //         const {enhancedElement, transformScope, transform} = self;
    //         const {Tx} = await import('trans-render/lib/Tx.js');
    //         this.#tx = new Tx(self, enhancedElement, transform!, transformScope!);
    //     }
    //     await this.#tx.transform();
    //     return {
    //         resolved: true
    //     }
    // }

    // #txWhenMax: ITx | undefined;
    // async txWhenMax(self: this){
    //     if(this.#txWhenMax === undefined){
    //         const {enhancedElement, transformScope, transformWhenMax} = self;
    //         const {Tx} = await import('trans-render/lib/Tx.js');
    //         this.#txWhenMax = new Tx(self, enhancedElement, transformWhenMax!, transformScope!);
    //     }
    //     this.#txWhenMax.transform();
    // }

    async hydrateTransform(self: this): ProPAP{
        const {transformScope, enhancedElement, transform} = self;
        const {findRealm} = await import('trans-render/lib/findRealm.js');
        const target = await findRealm(enhancedElement, transformScope!);
        const propagator = (<any>self).xtalState;
        const {Transform} = await import('trans-render/Transform.js');
        const transformer =  await Transform(target as Element, self, transform!, {
            propagator
        });
        return {
            transformer
        }
    }
}

export interface BeCounted extends AllProps{}

export const tagName = 'be-counted';


const xe = new XE<AP, Actions>({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            step: 1,
            min: 0, 
            loop: false,
            incOn: 'click',
            value: 0,
            transformScope: 'p',
            checked: false,
        },
        propInfo:{
            ...propInfo,
            value: {
                notify:{
                    dispatch: true
                }
            }
        },
        actions: {
            check: {
                ifKeyIn: ['value'],
                secondArg: {
                    checked: true,
                    isMaxedOut: false,
                }
            },
            hydrate: {
                ifAllOf: ['incOn', 'checked', 'isParsed'],
                ifKeyIn: ['lt', 'ltOrEq'],
                ifNoneOf: ['isMaxedOut'],
            },
            disableInc: {
                ifAllOf: ['isMaxedOut']
            },
            hydrateTransform:{
                ifAllOf: ['transform', 'isParsed'],
            },
            
        },
    },
    superclass: BeCounted
});
