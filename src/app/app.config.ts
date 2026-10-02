import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// deixa o pipe number no padrao brasileiro (9,2 em vez de 9.2)
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), { provide: LOCALE_ID, useValue: 'pt-BR' }],
};
