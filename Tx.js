import { getHost } from 'trans-render/lib/getHost.js';
export class Tx {
    model;
    realmCitizen;
    #ctx;
    #realm;
    constructor(model, realmCitizen, match) {
        this.model = model;
        this.realmCitizen = realmCitizen;
        // const target = pram.transformFromClosest !== undefined ?
        //     proxy.closest(pram.transformFromClosest)
        //     : host.shadowRoot || host!;
        const host = (getHost(realmCitizen, true) || document);
        this.#realm = host.shadowRoot || host;
        this.#ctx = {
            match,
            host: model,
            initiator: realmCitizen
        };
    }
    async transform() {
        const { DTR } = await import('trans-render/lib/DTR.js');
        await DTR.transform(this.#realm, this.#ctx);
    }
}
