// @ts-check
import { BE } from 'be-enhanced/BE.js';
import { propInfo, resolved, rejected } from 'be-enhanced/cc.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AP, BAP, ObservingParameters} from './ts-refs/be-counted/types' */
/** @import {SetOptions} from './ts-refs/trans-render/asmr/types' */

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
        },
        propInfo:{
            count: {
                //ro: true
            },
            value: {
                ro: true
            },
            parsedStatements: {
                ro: true,
            },
            nudges: {},
            lt: {},
            ltOrEq: {},
            isMaxedOut: {
                ro: true,
                def: false
            },
            disableOnMax: {},
            once: {},
        },
        compacts:{
            when_count_changes_invoke_onCount: 0,
        },
        actions:{
            hydrate: {
                ifAllOf: ['step', 'incOn']
            },
            onOnce:{
                ifAllOf: ['once']
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
        const {enhancedElement, min, incOn, parsedStatements, nudges} = self;
        if(parsedStatements !== undefined){
            const {find} = await import('trans-render/dss/find.js');
            const {ASMR} = await import('trans-render/asmr/asmr.js');
            const {ASMRHandler} = await import('./ASMRHandler.js');
            for(const parsedStatement of parsedStatements){
                const {remoteSpecifiers, localProp} = parsedStatement;
                for(const remoteSpecifier of remoteSpecifiers){
                    const remoteEl = await find(enhancedElement, remoteSpecifier);
                    if(remoteEl === null) throw 404;
                    const so = await ASMR.getSO(remoteEl, {
                        path: remoteSpecifier.path
                    });
                    new ASMRHandler(self, localProp, so);
                }

            }
        }
        enhancedElement.addEventListener(incOn, this);
        if(nudges){
            await self.nudge();
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
            const {loop, disableOnMax, enhancedElement} = self;
            if(loop){
                return {
                    value: min
                };
            }else{
                if(disableOnMax && 'disabled' in enhancedElement){
                    enhancedElement.disabled = true;
                }
                return {
                    isMaxedOut
                }
            }
        }
        return /** @type {PAP} */({
            value: newVal,
            isMaxedOut
        })
    }

    /**
     * 
     * @param {BAP} self 
     */
    onOnce(self){
        return /** @type {PAP} */({
            lt: 1,
            min: 0,
            step: 1,
            disableOnMax: true,
            nudges: true,
        });
    }
}

await BeCounted.bootUp();
export {BeCounted}