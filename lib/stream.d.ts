/// <reference types="node" />
import { EventEmitter } from 'events';
import Instagram from './index';
declare class Stream extends EventEmitter {
    private instagram;
    private endpoint;
    private runOnCreation;
    private interval;
    private minTagId;
    private intervalId;
    private cache;
    private accessToken;
    private startDate;
    constructor(instagram: Instagram, endpoint: string, options?: any);
    start(): void;
    stop(): void;
    private makeRequest;
}
export default Stream;
