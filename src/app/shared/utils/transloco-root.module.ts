import {
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule
} from '@ngneat/transloco';
import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';

import { Injectable, NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { httpLoader } from './http-loades';

@Injectable({ providedIn: 'root' })

@NgModule({
  exports: [TranslocoModule],
  imports: [
    TranslocoPersistLangModule.forRoot({
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage,
      },
    })
  ],
  providers: [httpLoader,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'uk'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: environment.production
      })
    }
  ]
})
export class TranslocoRootModule { }