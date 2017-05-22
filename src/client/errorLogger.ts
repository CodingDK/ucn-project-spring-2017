/**
 * This file is used to setup the jsnLog and after that it is import into the polyfills.ts, so it get loaded before Angular
 */
import { JL } from 'jsnlog';

JL.setOptions({
  defaultAjaxUrl: 'http://localhost:3000/jsnlog.logger'
});
