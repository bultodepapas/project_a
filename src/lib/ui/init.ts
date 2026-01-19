import { initHeaderUI } from './header';
import { initLangSwitchUI } from './lang-switch';
import { initThemeToggleUI } from './theme-toggle';
import { initCaseFiltersUI } from './case-filters';
import { initArticleFiltersUI } from './article-filters';
import { initContactUI } from './contact';
import { initHeroUI } from './hero';
import { initLanguagesUI } from './languages';
import { initTimelineUI } from './timeline';
import { initProofStripUI } from './proof-strip';
import { initAwardsUI } from './awards';
import { initEducationUI } from './education';
import { initHiredForUI } from './hired-for';

export function initUI() {
  initHeaderUI();
  initLangSwitchUI();
  initThemeToggleUI();
  initCaseFiltersUI();
  initArticleFiltersUI();
  initContactUI();
  initHeroUI();
  initLanguagesUI();
  initTimelineUI();
  initProofStripUI();
  initAwardsUI();
  initEducationUI();
  initHiredForUI();
}
