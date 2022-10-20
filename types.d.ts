import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';
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

export type PA = Partial<PP>;

export interface Actions{
    hydrate(pp: PP): [PA, EventConfigs<Proxy, Actions>];
    inc(pp: PP): PA;
    tx(pp: PP): void;
    finale(): void;
}

