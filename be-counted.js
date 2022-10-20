import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeCounted extends EventTarget {
    #abortController;
    #tx;
    onIncOn(pp) {
        const { self, incOn, proxy, min } = pp;
        if (!this.check(pp))
            return [{}, {}]; //clears event handler
        return [{
                value: min,
                resolved: true,
            }, {
                [incOn]: {
                    observe: self,
                    action: 'do',
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
    async do(pp) {
        const { proxy, step, transform } = pp;
        proxy.value += step;
        if (transform !== undefined) {
            const { self, transformScope } = pp;
            if (this.#tx === undefined) {
                const { Tx } = await import('trans-render/lib/Tx.js');
                this.#tx = new Tx(proxy, self, transform, transformScope);
            }
            this.#tx.transform();
        }
        if (!this.check(pp)) {
            return {
                incOff: true
            };
        }
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
            onIncOn: {
                ifAllOf: ['incOn'],
                ifKeyIn: ['lt', 'ltOrEq', 'incOff']
            }
        }
    },
    complexPropDefaults: {
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
