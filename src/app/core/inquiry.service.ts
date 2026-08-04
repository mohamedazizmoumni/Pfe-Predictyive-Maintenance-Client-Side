import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InquiryPayload {
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  submitContact(payload: InquiryPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/public/contact`, payload);
  }

  submitDemoRequest(payload: InquiryPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/public/demo-request`, payload);
  }
}
