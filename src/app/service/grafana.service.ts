import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class GrafanaService {
  constructor(private http: HttpClient) {}

  getDashboardInfo() {
    return this.http
      .get("http://10.111.24.229:3000/api/dashboards/uid/kztSL9aZk")
      .pipe(map(resp => resp));
  }
}
