
/** @import {RoundaboutReady} from './ts-refs/trans-render/froop/types' */
/** @import {SharingObject} from  './ts-refs/trans-render/asmr/types'*/

/**
 * @implements {EventListenerObject}
 */
export class ASMRHandler{
    /** @type {SharingObject} */
    #so;
    /** @type {string} */
    #prop;
    /** @type {RoundaboutReady} */
    #self;
    /**
     * 
     * @param {RoundaboutReady} self 
     * @param {string} prop
     * @param {SharingObject} so
     */
    constructor(self, prop, so){
        this.#so = so;
        this.#prop = prop;
        this.#self = self;
        self.propagator.addEventListener(prop, this);
        this.handleEvent();
    }

    handleEvent(){
        this.#so.setValue(this.#self[this.#prop]);
    }
}