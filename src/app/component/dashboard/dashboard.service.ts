import { Injectable } from "@angular/core";
import { GrafanaService } from "src/app/service/grafana.service";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  constructor(private grafanaService: GrafanaService) {}

  generateIframeSnippet(dashboardTitle: String, panelId) {
    const processedTitle = dashboardTitle.replace(" ", "-").toLowerCase();
    const to = Date.now();
    const from = to - 24 * 60 * 60 * 1000;
    return `<iframe src="http://10.111.24.229:3000/d-solo/kztSL9aZk/${processedTitle}?orgId=1&from=${from}&to=${to}&panelId=${panelId}" width="100%" height="100%" frameborder="0"></iframe>`;
  }
}
