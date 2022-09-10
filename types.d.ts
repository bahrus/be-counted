import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps {
    step?: number;
    ltOrEq?: number;
    lt?: number;
    min?: number;
    loop?: boolean;
    transformWhenMax?: any;
    transform?: any;
    nudge?: boolean;
    incOn?: string;
    incOnSet?: string;
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
    onIncOn(pp: PP): void;
    finale(proxy: Proxy, self: Element, beDecor: BeDecoratedProps): void;
}