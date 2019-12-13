import { Component, OnDestroy } from "@angular/core";
import { GrafanaService } from "./service/grafana.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "embed-cms-demo-app";

  constructor() {}
}
