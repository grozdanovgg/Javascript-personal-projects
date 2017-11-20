import { DEFAULT_BREAKPOINTS } from '@angular/flex-layout';

const PRINT_BREAKPOINTS = [{
    alias: 'xs.print',
    suffix: 'XsPrint',
    mediaQuery: 'print and (max-width: 297px)',
    overlapping: false
}];

export const CustomBreakPointsProvider = {
    provide: BREAKPOINTS,
    useValue: [...DEFAULT_BREAKPOINTS, ...PRINT_BREAKPOINTS];
};