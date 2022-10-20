import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeCounted extends EventTarget {
    #abortController;
    #tx;
    doIncOn(pp) {
        const { self, incOn, proxy, min } = pp;
        if (!this.check(pp))
            return [{}, {}]; //clears event handler
        return [{
                value: min,
                resolved: true,
            }, {
                [incOn]: {
                    observe: self,
                    action: 'inc',
                    doInit: false,
                }
            }];
    }
    check({ step, ltOrEq, lt, value }) {
        if (step > 0) {
            if (ltOrEq === undefined && lt === undefined)
                return true;
            if (ltOrEq !== undefined) {
                return step + value <= ltOrEq;
            }
            return step + value < lt;
        }
    }
    async inc(pp) {
        const { proxy, step, transform } = pp;
        proxy.value += step;
        if (!this.check(pp)) {
            return {
                incOff: true
            };
        }
    }
    async tx(pp) {
        const { self, transformScope, proxy } = pp;
        if (this.#tx === undefined) {
            const { transform } = pp;
            const { Tx } = await import('trans-render/lib/Tx.js');
            this.#tx = new Tx(proxy, self, transform, transformScope);
        }
        this.#tx.transform();
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
                'nudge', 'step', 'value', 'transform', 'transformScope', 'incOff'
            ],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                value: 0,
                transformScope: 'parent'
            },
            emitEvents: ['value'],
            //finale: 'finale'
        },
        actions: {
            doIncOn: {
                ifAllOf: ['incOn'],
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
