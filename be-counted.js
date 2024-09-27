// @ts-check
import { BE } from 'be-enhanced/BE.js';
import { propInfo, resolved, rejected } from 'be-enhanced/cc.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AP, BAP, ObservingParameters} from './ts-refs/be-counted/types' */

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 */
class BeCounted extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement, any>}
     */
    static config = {
        propDefaults:{
            min: 0,
            step: 1,
            incOn: 'click',
            isMaxedOut: false,
        },
        propInfo:{
            count: {},
            value: {},
            parsedStatements: {},
            nudge: {}
        },
        compacts:{
            when_count_changes_invoke_onCount: 0,
        },
        actions:{
            hydrate: {
                ifAllOf: ['step', 'incOn']
            }
        },
        positractions: [
            resolved, rejected
        ]
    }

    /**
     * 
     * @param {BAP} self 
     */
    async hydrate(self){
        const {enhancedElement, min, incOn, parsedStatements, nudge} = self;
        console.log({parsedStatements});
        if(parsedStatements !== undefined){
            const {find} = await import('trans-render/dss/find.js');
            const {ASMR} = await import('trans-render/asmr/asmr.js');
            const {ASMRHandler} = await import('./ASMRHandler.js');
            for(const parsedStatement of parsedStatements){
                const {remoteSpecifiers, localProp} = parsedStatement;
                for(const remoteSpecifier of remoteSpecifiers){
                    const remoteEl = await find(enhancedElement, remoteSpecifier);
                    if(remoteEl === null) throw 404;
                    const so = await ASMR.getSO(remoteEl);
                    new ASMRHandler(self, localProp, so);
                }

            }
        }
        enhancedElement.addEventListener(incOn, this);
        if(nudge){
            const {nudge} = await import('trans-render/lib/nudge.js');
            nudge(enhancedElement);
        }
        return /** @type {PAP} */({
            count: min,
            resolved: true
        })
    }

    handleEvent(){
        const self = /** @type {BAP} */ (/** @type {any} */(this));
        //const {step} = self;
        self.count += 1;
    }

    /**
     * 
     * @param {BAP} self 
     */
    onCount(self){
        const {step, lt, ltOrEq, value, min} = self;
        if(value === undefined){
            return {
                value: min
            };
        }
        const newVal = value + step;
        let isMaxedOut = false;
        if(lt !== undefined){
            if(newVal >= lt){
                isMaxedOut = true;
            }
        }else if(ltOrEq !== undefined){
            if(newVal > ltOrEq){
                isMaxedOut = true;
            }
        }
        if(isMaxedOut){
            const {loop} = self;
            if(loop){
                return {
                    value: min
                };
            }
        }
        return {
            value: newVal,
            isMaxedOut
        }
    }
}

await BeCounted.bootUp();
export {BeCounted}