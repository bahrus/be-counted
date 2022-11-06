import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeCounted extends EventTarget {
    #tx;
    hydrate(pp) {
        const { self, incOn, min, incOff } = pp;
        if (incOff)
            return [{}, {}]; //clears event handler
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
                    incOff: false,
                    checked: true,
                };
            if (ltOrEq !== undefined) {
                return {
                    incOff: step + value > ltOrEq,
                    checked: true,
                };
            }
            return {
                incOff: step + value >= lt,
                checked: true,
            };
        }
        return {
            incOff: false,
            checked: true,
        };
    }
    inc(pp) {
        let { value, step } = pp;
        return {
            value: value + step,
        };
    }
    async tx(pp) {
        if (this.#tx === undefined) {
            const { self, transformScope, proxy } = pp;
            const { transform } = pp;
            const { Tx } = await import('trans-render/lib/Tx.js');
            this.#tx = new Tx(proxy, self, transform, transformScope);
        }
        this.#tx.transform();
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
                'nudge', 'step', 'value', 'transform', 'transformScope', 'incOff', 'checked'
            ],
            nonDryProps: ['incOff', 'incOn'],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                checked: false,
                value: 0,
                transformScope: 'parent'
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
                ifKeyIn: ['lt', 'ltOrEq', 'incOff']
            },
            tx: {
                ifAllOf: ['transform'],
                ifKeyIn: ['value']
            }
        }
    },
    complexPropDefaults: {
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
