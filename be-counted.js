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
            value: {},
            parsedStatements: {},
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
        const {enhancedElement, min, incOn, parsedStatements} = self;
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