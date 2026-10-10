import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/** URL base de la API REST. Se puede sobrescribir en pruebas con { provide: API_BASE_URL, useValue: ... }. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});
