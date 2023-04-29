import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, ProPOA, POA} from './types';
import {register} from 'be-hive/register.js';

export class BeCounted extends BE<AP, Actions> implements Actions{

    check(self: this): PAP{
        const {step, ltOrEq, lt, value} = self;
        const allGood = {
            checked: true,
            isMaxedOut: false,
        } as PAP;
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
        const {enhancedElement, incOn, min, nudge} = self;
        if(nudge){
            const {nudge: n} = await import('trans-render/lib/nudge.js');
            n(self);
        }
        return [{
            resolved: true,
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
}

export interface BeCounted extends AllProps{}

const tagName = 'be-counted';
const ifWantsToBe = 'counted';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            step: 1,
            min: 0, 
            loop: false,
            incOn: 'click',
            checked: false,
            value: 0,
            transformScope: 'p'
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
            },
            hydrate: {
                ifAllOf: ['incOn', 'checked'],
                ifKeyIn: ['lt', 'ltOrEq'],
                ifNoneOf: ['isMaxedOut'],
            }
        },
    },
    superclass: BeCounted
});

register(ifWantsToBe, upgrade, tagName);