import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
export class BeCounted extends BE {
    static get beConfig() {
        return {
            parse: true,
            isParsedProp: 'isParsed'
        };
    }
    check(self, allGood) {
        const { step, ltOrEq, lt, value } = self;
        if (step > 0) {
            if (ltOrEq === undefined && lt === undefined)
                return allGood;
            if (ltOrEq !== undefined) {
                return {
                    isMaxedOut: step + value > ltOrEq,
                    checked: true,
                };
            }
            return {
                isMaxedOut: step + value >= lt,
                checked: true,
            };
        }
        return allGood;
    }
    async hydrate(self, mold) {
        const { enhancedElement, incOn, min, nudge, transform } = self;
        if (nudge) {
            const { nudge: n } = await import('trans-render/lib/nudge.js');
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
            }];
    }
    inc(self) {
        const { value, step } = self;
        return {
            value: value + step,
        };
    }
    disableInc(self) {
        const { enhancedElement, incOn } = self;
        return [, {
                inc: {
                    abort: {
                        origMethName: 'hydrate',
                        on: incOn,
                        of: enhancedElement
                    }
                }
            }];
    }
    async hydrateTransform(self) {
        const { transformScope, enhancedElement, transform } = self;
        const { findRealm } = await import('trans-render/lib/findRealm.js');
        const target = await findRealm(enhancedElement, transformScope);
        const propagator = self.xtalState;
        const { Transform } = await import('trans-render/Transform.js');
        const transformer = await Transform(target, self, transform, {
            propagator
        });
        return {
            transformer
        };
    }
}
export const tagName = 'be-counted';
const xe = new XE({
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
        propInfo: {
            ...propInfo,
            value: {
                notify: {
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
            hydrateTransform: {
                ifAllOf: ['transform', 'isParsed'],
            },
        },
    },
    superclass: BeCounted
});
