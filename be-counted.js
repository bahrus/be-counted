import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
import { inject } from 'be-decorated/inject.js';
export class BeCounted extends EventTarget {
    async hydrate(pp, mold) {
        const { self, incOn, min: value, nudge } = pp;
        if (nudge) {
            const { nudge: n } = await import('trans-render/lib/nudge.js');
            n(self);
        }
        return inject({
            mold,
            tbdSlots: {
                on: incOn,
                of: self
            }
        });
    }
    check({ step, ltOrEq, lt, value }, mold) {
        if (step > 0) {
            if (ltOrEq === undefined && lt === undefined)
                return mold;
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
        return mold;
    }
    inc(pp) {
        let { value, step } = pp;
        return {
            value: value + step,
        };
    }
    disableInc({ self }, mold) {
        return inject({
            mold,
            tbdSlots: {
                of: self
            }
        });
    }
    #tx;
    async tx(pp) {
        if (this.#tx === undefined) {
            const { self, transformScope, proxy, transform } = pp;
            const { Tx } = await import('trans-render/lib/Tx.js');
            this.#tx = new Tx(proxy, self, transform, transformScope);
        }
        this.#tx.transform();
    }
    #txWhenMax;
    async txWhenMax(pp) {
        if (this.#txWhenMax === undefined) {
            const { self, transformScope, proxy, transformWhenMax } = pp;
            const { Tx } = await import('trans-render/lib/Tx.js');
            this.#txWhenMax = new Tx(proxy, self, transformWhenMax, transformScope);
        }
        this.#txWhenMax.transform();
    }
    finale() {
        this.#tx = undefined;
        this.#txWhenMax = undefined;
    }
}
const tagName = 'be-counted';
const ifWantsToBe = 'counted';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: [
                'incOn', 'incOnSet', 'loop', 'lt', 'ltOrEq', 'min',
                'nudge', 'step', 'value', 'transform', 'transformScope', 'checked', 'transformWhenMax', 'isMaxedOut'
            ],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                checked: false,
                value: 0,
                transformScope: 'parent',
            },
            emitEvents: ['value'],
        },
        actions: {
            check: {
                ifKeyIn: ['value'],
                returnObjMold: {
                    isMaxedOut: false,
                    checked: true,
                }
            },
            hydrate: {
                ifAllOf: ['incOn', 'checked'],
                ifKeyIn: ['lt', 'ltOrEq'],
                ifNoneOf: ['isMaxedOut'],
                returnObjMold: [{
                        value: 0,
                        resolved: true,
                    }, {
                        inc: {
                            on: 'tbd',
                            of: 'tbd',
                            doInit: false,
                        }
                    }]
            },
            disableInc: {
                ifAllOf: ['isMaxedOut'],
                returnObjMold: [, {
                        'inc': {
                            abort: {
                                origMethName: 'hydrate',
                                of: 'tbd',
                                on: 'click'
                            },
                        }
                    }]
            },
            tx: {
                ifAllOf: ['transform'],
                ifKeyIn: ['value']
            },
            txWhenMax: {
                ifAllOf: ['transformWhenMax', 'isMaxedOut']
            }
        }
    },
    complexPropDefaults: {
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
