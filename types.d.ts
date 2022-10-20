import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {MatchRHS, Scope} from 'trans-render/lib/types';

export interface EndUserProps {
    step?: number;
    ltOrEq?: number;
    lt?: number;
    min?: number;
    loop?: boolean;
    transformWhenMax?: any;
    transform?: {[key: string]: MatchRHS};
    transformScope?: Scope;
    nudge?: boolean;
    incOn?: string;
    incOnSet?: string;
    incOff?: boolean;
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    value: number;

}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy
}

export type PP = ProxyProps;

export interface Actions{
    hydrate(pp: PP): void;
    inc(pp: PP): void;
    tx(pp: PP): void;
    //finale(proxy: Proxy, self: Element, beDecor: BeDecoratedProps): void;
}

