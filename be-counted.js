import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeCounted extends EventTarget {
    #abortController;
    #tx;
    onIncOn(pp) {
        const { self, incOn, proxy, min } = pp;
        proxy.resolved = true;
        this.disconnect();
        if (!this.check(pp))
            return;
        proxy.value = min;
        self.addEventListener(incOn, async (e) => {
            await this.do(pp);
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
    async do(pp) {
        const { proxy, step, value, ltOrEq, lt, transform, self } = pp;
        proxy.value += step;
        if (transform !== undefined) {
            if (this.#tx === undefined) {
                const { Tx } = await import('./Tx.js');
                this.#tx = new Tx(proxy, self, transform);
            }
            this.#tx.transform();
        }
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
                'nudge', 'step', 'value', 'transform'
            ],
            proxyPropDefaults: {
                step: 1,
                min: 0,
                loop: false,
                incOn: 'click',
                value: 0,
            },
            emitEvents: ['value'],
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
