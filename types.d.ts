import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';
import {MatchRHS, Scope} from 'trans-render/lib/types';

export interface EndUserProps {
    /**
     * How much to increment on each event
     */
    step?: number;
    /**
     * Don't allow count to exceed this number
     */
    ltOrEq?: number;
    /** Don't allow count to reach this number. */
    lt?: number;
    /**
     * Starting value of count, including after looping
     */
    min?: number;
    /**
     * Make count loop back to min value after hitting the ceiling set by ltOrEq or lt
     */
    loop?: boolean;
    /**
     * DTR transform to perform when count hits the maximum value
     * See https://github.com/bahrus/trans-render for syntax
     */
    transformWhenMax?: any;
    /**
     * DTR transform to perform after count increments
     * See https://github.com/bahrus/trans-render for syntax
     */
    transform?: {[key: string]: MatchRHS};
    /**
     * Specify how wide the surrounding DOM should be subject to the transformation.
     * Values specified here: https://github.com/bahrus/trans-render/blob/baseline/lib/types.d.ts#L388
     */
    transformScope?: Scope;
    /**
     * Slowly "awaken" a disabled element.  If the disabled attribute is not set to a number, or is set to "1", removes the disabled attribute.  If it is a larger number, decrements the number by 1. 
     */
    nudge?: boolean;
    /**
     * Event name to trigger count increment
     */
    incOn?: string;
    /**
     * Property to subscribe to trigger count increment
     */
    incOnSet?: string;
    
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    value: number;
    checked: boolean;
    isMaxedOut?: boolean;
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy
}

export type PP = ProxyProps;

export type PA = Partial<PP>;

export type PPE = [PA | undefined, EventConfigs<Proxy, Actions>];

export interface Actions{
    hydrate(pp: PP): Promise<PPE>;
    inc(pp: PP): PA;
    disableInc(pp: PP): PPE;
    check(pp: PP): PA;
    tx(pp: PP): Promise<void>;
    finale(): void;
    txWhenMax(pp: PP): Promise<void>;
}

