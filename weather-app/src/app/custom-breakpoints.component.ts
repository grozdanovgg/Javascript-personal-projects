import { BreakPoint, DEFAULT_BREAKPOINTS } from '@angular/flex-layout';
import { validateSuffixes } from '@angular/flex-layout';

const CUSTOM = {
    'sm': 'screen and (max-width: 766px)',
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
