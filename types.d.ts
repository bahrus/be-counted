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
    isMaxedOut?: boolean;
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    value: number;
    checked: boolean;
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy
}

export type PP = ProxyProps;

export type PA = Partial<PP>;

export type PPE = [PA | undefined, EventConfigs<Proxy, Actions>];

export interface Actions{
    hydrate(pp: PP): PPE;
    inc(pp: PP): PA;
    disableInc(pp: PP): PPE;
    check(pp: PP): PA;
    tx(pp: PP): Promise<void>;
    finale(): void;
    txWhenMax(pp: PP): Promise<void>;
}

