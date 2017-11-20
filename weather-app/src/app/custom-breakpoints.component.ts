import { BreakPoint, DEFAULT_BREAKPOINTS } from '@angular/flex-layout';
import { validateSuffixes } from '@angular/flex-layout';

const CUSTOM = {
    // 'xs': 'screen and (max-width: 599px)',
    // 'gt-xs': 'screen and (min-width: 600px)',
    'sm': 'screen and (max-width: 767px)',
    // 'gt-sm': 'screen and (min-width: 768px)',
    // 'md': 'screen and (min-width: 768px) and (max-width: 1440px)',
    // 'gt-md': 'screen and (min-width: 1440px)',
    // 'lg': 'screen and (min-width: 1440px) and (max-width: 1919px)',
    // 'gt-lg': 'screen and (min-width: 1920px)',
    // 'xl': 'screen and (min-width: 1920px) and (max-width: 5000px)',
};

function updateMediaQuery(it: BreakPoint) {
    const mq = CUSTOM[it.alias];
    if (!!mq) {
        it.mediaQuery = mq;
    }
    return it;
}

export function CUSTOM_BREAKPOINT_FACTORY() {
    return validateSuffixes(DEFAULT_BREAKPOINTS.map(updateMediaQuery));
}
