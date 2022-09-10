import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeCounted extends EventTarget {
    #abortController;
    onIncOn(pp) {
        const { self, incOn, proxy, min } = pp;
        proxy.resolved = true;
        this.disconnect();
        if (!this.check(pp))
            return;
        proxy.value = min;
        self.addEventListener(incOn, e => {
            this.do(pp);
        }, { signal: this.#abortController?.signal });
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
    do(pp) {
        const { proxy, step, value, ltOrEq, lt } = pp;
        proxy.value += step;
        console.log({ value: proxy.value });
        if (!this.check(pp)) {
            this.disconnect();
        }
    }
    disconnect() {
        if (this.#abortController !== undefined) {
            this.#abortController.abort();
        }
    }
    finale(proxy, self, beDecor) {
        this.disconnect();
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
            virtualProps: ['incOn', 'incOnSet', 'loop', 'lt', 'ltOrEq', 'min', 'nudge', 'step', 'value'],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                value: 0,
            },
            finale: 'finale'
        },
        actions: {
            onIncOn: {
                ifAllOf: ['incOn'],
                ifKeyIn: ['lt', 'ltOrEq']
            }
        }
    },
    complexPropDefaults: {
        controller: BeCounted
    }
});
register(ifWantsToBe, upgrade, tagName);
