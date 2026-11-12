import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EligibilityCheckResponse {
  isEligible: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class LaunchService {
  private readonly http = inject(HttpClient);

  checkEligibility(gameId: string): Observable<EligibilityCheckResponse> {
    return this.http.post<EligibilityCheckResponse>('/api/launch/eligibility-check', { gameId });
  }
}
