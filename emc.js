// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP,  AP} from './ts-refs/be-counted/types' */;
/** @import {CSSQuery} from './ts-refs/trans-render/types.js' */

const andShareValue = String.raw `^(a|A)nd share (?<localProp>.*) with (?<recipients>.*)`;

/**
 * @type {Array<[string, string]>}
 */
const dssArrayKeys = [['recipients', 'remoteSpecifiers']];

/**
 * @type {Partial<EMC<any, AP>>}
 */
export const emc = {
    base: 'be-counted',
    branches: ['', 'config', 'step', 'lt-or-eq', 'once', 'lt', 'min', 'loop', 'nudge', 'inc-on'],
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts:{
                parsedStatements: [
                    {
                        regExp: andShareValue,
                        defaultVals:{},
                        dssArrayKeys
                    }
                ]
            }
        },
        '1.0': {
            instanceOf: 'Object',
            mapsTo: '.'
        },
        '2.0': {
            instanceOf: 'Number',
            mapsTo: 'step'
        },
        '3.0': {
            instanceOf: 'Number',
            mapsTo: 'ltOrEq'
        },
        '4.0': {
            instanceOf: 'Boolean',
            mapsTo: 'once'
        },
        '5.0': {
            instanceOf: 'Number',
            mapsTo: 'lt'
        },
        '6.0':{
            instanceOf: 'Number',
            mapsTo: 'min'
        },
        '7.0': {
            instanceOf: 'Boolean',
            mapsTo: 'loop'
        },
        '8.0': {
            instanceOf: 'Boolean',
            mapsTo: 'nudges'
        },
        '9.0': {
            instanceOf: 'String',
            mapsTo: 'incOn'
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