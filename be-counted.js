import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeCounted extends BE {
    static get beConfig() {
        return {
            parse: true,
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
        const { enhancedElement, incOn, min, nudge } = self;
        if (nudge) {
            const { nudge: n } = await import('trans-render/lib/nudge.js');
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
    #tx;
    async tx(self) {
        if (this.#tx === undefined) {
            const { enhancedElement, transformScope, transform } = self;
            const { Tx } = await import('trans-render/lib/Tx.js');
            this.#tx = new Tx(self, enhancedElement, transform, transformScope);
        }
        this.#tx.transform();
    }
    #txWhenMax;
    async txWhenMax(self) {
        if (this.#txWhenMax === undefined) {
            const { enhancedElement, transformScope, transformWhenMax } = self;
            const { Tx } = await import('trans-render/lib/Tx.js');
            this.#txWhenMax = new Tx(self, enhancedElement, transformWhenMax, transformScope);
        }
        this.#txWhenMax.transform();
    }
}
const tagName = 'be-counted';
const ifWantsToBe = 'counted';
const upgrade = '*';
const xe = new XE({
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
                ifAllOf: ['incOn', 'checked'],
                ifKeyIn: ['lt', 'ltOrEq'],
                ifNoneOf: ['isMaxedOut'],
            },
            disableInc: {
                ifAllOf: ['isMaxedOut']
            },
            tx: {
                ifAllOf: ['transform'],
                ifKeyIn: ['value']
            },
            txWhenMax: {
                ifAllOf: ['transformWhenMax', 'isMaxedOut']
            }
        },
    },
    superclass: BeCounted
});
register(ifWantsToBe, upgrade, tagName);
