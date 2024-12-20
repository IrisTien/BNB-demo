import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { map } from "rxjs/operators";

const INTERVAL_UNIT_MAP = {
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
};

@Injectable({
  providedIn: "root"
})
export class GrafanaService {
  constructor(private http: HttpClient) {}

  getChartIframe(metricField, metricType, title, interval) {
    let from, to;
    if (interval && interval !== "custom") {
      from = `now-${interval}`;
      to = "now";
    }
    return this.http
      .post(
        `https://demo-group10101-sunny.devframe.cp.horizon.vmware.com/demo-base/v1/panels`,
        {
          metricsfield: metricField,
          metricstype: metricType,
          from: from,
          to: to,
          title: title
        },
        {
          responseType: "text",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
      .pipe(
        map(iframeUrl => {
          return iframeUrl;
        })
      );
    // return this.http
    //   .get("http://10.111.24.229:3000/api/dashboards/uid/kztSL9aZk")
    //   .pipe(map(resp => resp));
  }

  generateIFrameWithTimeStamp(iframeUrl, interval) {
    let toInMs = Date.now();
    let fromInMs = toInMs - this.parseIntervalToMilliseconds(interval);
    return `<iframe src="${iframeUrl}&from=${fromInMs}&to=${toInMs}" width="100%" height="100%" frameborder="0"></iframe>`;
  }

  private parseIntervalToMilliseconds(interval: string) {
    const unitKeys = Object.keys(INTERVAL_UNIT_MAP);
    for (let i = 0; i < unitKeys.length; i++) {
      if (interval.indexOf(unitKeys[i]) !== -1) {
        let intervalInNum = Number(interval.split(unitKeys[i])[0]);
        return intervalInNum * INTERVAL_UNIT_MAP[unitKeys[i]];
      }
    }
  }
}
