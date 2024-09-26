// @ts-check
import { BE } from 'be-enhanced/BE.js';
import { propInfo, resolved, rejected } from 'be-enhanced/cc.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AP, BAP, ObservingParameters} from './ts-refs/be-counted/types' */

/**
 * @implements {Actions}
 * 
 */
class BeCounted extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement, any>}
     */
    static config = {
        propDefaults:{
            isParsed: true,
            min: 0,
            step: 1
        },
        propInfo:{

        },
        actions:{

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

    }
}

await BeCounted.bootUp();
export {BeCounted}