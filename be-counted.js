import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeCounted extends EventTarget {
    #abortController;
    #ctx;
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
        const { proxy, step, value, ltOrEq, lt, transformWhenInc, self } = pp;
        proxy.value += step;
        if (transformWhenInc !== undefined) {
            if (this.#ctx === undefined) {
                this.#ctx = {
                    match: transformWhenInc,
                    host: proxy,
                };
            }
            // const target = pram.transformFromClosest !== undefined ?
            //     proxy.closest(pram.transformFromClosest)
            //     : host.shadowRoot || host!;
            const { getHost } = await import('trans-render/lib/getHost.js');
            const host = (getHost(proxy, true) || document);
            const target = host.shadowRoot || host;
            const { DTR } = await import('trans-render/lib/DTR.js');
            await DTR.transform(target, this.#ctx);
            this.#ctx.initiator = self;
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
                'nudge', 'step', 'value', 'transformWhenInc'
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
