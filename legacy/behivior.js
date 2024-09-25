import { register } from 'be-hive/register.js';
import { tagName } from './be-counted.js';
import './be-counted.js';
const ifWantsToBe = 'counted';
const upgrade = '*';
register(ifWantsToBe, upgrade, tagName);
