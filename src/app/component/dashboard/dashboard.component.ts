import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { GrafanaService } from "src/app/service/grafana.service";
import { DashboardService } from "./dashboard.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild("visualContainer", { static: true })
  visualContainer: any;

  showTitle: boolean = false;
  title: string;
  yAxisTitle: string;
  fromDate: Date;
  toDate: Date;

  selections = {
    metric: "",
    agg: ""
  };
  options = [
    {
      title: "Metrics",
      field: "metric",
      selectValues: [
        {
          label: "CPU Total (MHz)",
          value: "c_total_mhz"
        },
        {
          label: "Memory Total",
          value: "m_total"
        }
      ],
      selection: "",
      onChange: (field, value) => {
        this.selections[field] = value;
      }
    },
    {
      title: "Aggregations",
      field: "agg",
      selectValues: [
        {
          label: "Average",
          value: "avergae"
        },
        {
          label: "Max",
          value: "max"
        },
        {
          label: "Min",
          value: "min"
        },
        {
          label: "Sum",
          value: "sum"
        }
      ],
      selection: "",
      onChange: (field, value) => {
        this.selections[field] = value;
      }
    }
  ];

  timeRange = {
    title: "Time Range",
    selectValues: [
      {
        label: "Last 24 hours",
        value: 24 * 60 * 60 * 1000
      },
      {
        label: "Last 2 days",
        value: 2 * 24 * 60 * 60 * 1000
      },
      {
        label: "Last 5 days",
        value: 5 * 24 * 60 * 60 * 1000
      },
      {
        label: "Last 7 days",
        value: 7 * 24 * 60 * 60 * 1000
      },
      {
        label: "Custom Range",
        value: -1
      }
    ],
    selection: 0
  };

  private subscriptions$: Subscription = new Subscription();
  private dashboardInfo;

  constructor(
    private grafanaService: GrafanaService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscriptions$) {
      this.subscriptions$.unsubscribe();
    }
  }

  generateChart() {
    console.log("button clicked!");
    console.log(this.timeRange.selection);

    this.subscriptions$.add(
      this.grafanaService.getDashboardInfo().subscribe((result: any) => {
        console.log(result);
        this.dashboardInfo = result;
        if (
          this.dashboardInfo &&
          this.dashboardInfo.dashboard &&
          this.dashboardInfo.dashboard.panels &&
          this.dashboardInfo.dashboard.panels.length
        ) {
          const snippet = this.dashboardService.generateIframeSnippet(
            this.dashboardInfo.dashboard.title,
            this.dashboardInfo.dashboard.panels[0].id
          );
          console.log(snippet);
          this.visualContainer.nativeElement.innerHTML = snippet;
        }
      })
    );
  }

  showDateTimePicker() {
    return Number(this.timeRange.selection) === -1;
  }
}
