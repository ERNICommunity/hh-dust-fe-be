import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { ConfigDto } from './config.dto';
@Injectable()
export class ConfigService {
  private static _autorefreshInterval: number;

  get autorefreshInterval(): number {
    return ConfigService._autorefreshInterval;
  }

  public static initialize(httpClient: HttpClient, baseUrl: string)  {
    return httpClient.get<ConfigDto>(`${baseUrl}api/clientConfiguration`).pipe(
      tap(c => ConfigService._autorefreshInterval = c.autorefreshIntervalMilisec));
  }
}
