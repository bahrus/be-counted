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
            incOn: 'click'
        },
        propInfo:{
            value: {}
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
        const {enhancedElement, min, incOn} = self;
        enhancedElement.addEventListener(incOn, this);
        return /** @type {PAP} */({
            value: min,
            resolved: true
        })
    }

    handleEvent(){
        const self = /** @type {BAP} */ (/** @type {any} */(this));
        const {step} = self;
        self.value += step;
    }
}

await BeCounted.bootUp();
export {BeCounted}