/**
 * Liquid Swirl UI Initialization
 * Registers and initializes the Liquid Swirl effect on contact cards
 */

import { initAllLiquidSwirls } from '../liquid-swirl';
import { initSection } from '../lifecycle';

export function initLiquidSwirlUI() {
  initSection('liquid-swirl', () => {
    const cleanup = initAllLiquidSwirls();
    return cleanup;
  });
}
