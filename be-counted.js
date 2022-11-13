import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeCounted extends EventTarget {
    hydrate(pp) {
        const { self, incOn, min } = pp;
        return [{
                value: min,
                resolved: true,
            }, {
                inc: {
                    on: incOn,
                    of: self,
                    doInit: false,
                }
            }];
    }
    check({ step, ltOrEq, lt, value }) {
        if (step > 0) {
            if (ltOrEq === undefined && lt === undefined)
                return {
                    isMaxed: false,
                    checked: true,
                };
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
        return {
            isMaxedOut: false,
            checked: true,
        };
    }
    inc(pp) {
        let { value, step } = pp;
        return {
            value: value + step,
        };
    }
    disableInc({ incOn, self }) {
        return [, {
                'inc': {
                    abort: incOn,
                }
            }];
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
            //finale: 'finale'
        },
        actions: {
            check: {
                ifKeyIn: ['value']
            },
            hydrate: {
                ifAllOf: ['incOn', 'checked'],
                ifKeyIn: ['lt', 'ltOrEq']
            },
            disableInc: 'isMaxedOut',
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
