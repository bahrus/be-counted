// @ts-check
import { MountObserver, seed, BeHive } from 'be-hive/be-hive.js';
import { emc as baseEMC } from './behivior.js';
/** @import  {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types' */;
/** @import {CSSQuery} from './ts-refs/trans-render/types.js' */

export const emc = {
    ...baseEMC,
    base: '🔢',
    enhPropKey: '🔢',
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);