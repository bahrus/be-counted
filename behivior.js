// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types.d.ts' */
/** @import {Actions, PAP,  AP} from './ts-refs/be-counted/types' */;
/** @import {CSSQuery} from './ts-refs/trans-render/types.js' */

/**
 * @type {Partial<EMC<any, AP>>}
 */
export const emc = {
    base: 'be-counted',
    branches: ['', 'step', 'lt-or-eq', 'lt', 'min', 'loop', 'nudge', 'incOn', 'incOnSet'],
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts:{}
        }
    },
    enhPropKey: 'beCounted',
    importEnh: async () => {
        const {BeCounted} = await import('./be-counted.js');
        return BeCounted;
    }
};

const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);