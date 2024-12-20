import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription, timer } from "rxjs";
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
  title: string = "";
  yAxisTitle: string;
  fromDate: Date;
  toDate: Date;
  refreshTime;
  refreshMessage: string;

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
        },
        {
          label: "Disk BPS",
          value: "d_bps"
        }
      ],
      selection: "d_bps",
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
          value: "avg"
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
      selection: "max",
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
        value: "24h"
      },
      {
        label: "Last 2 days",
        value: "2d"
      },
      {
        label: "Last 5 days",
        value: "5d"
      },
      {
        label: "Last 7 days",
        value: "7d"
      }
      // {
      //   label: "Custom Range",
      //   value: "custom"
      // }
    ],
    selection: "24h"
  };

  copied = false;

  private subscriptions$: Subscription = new Subscription();
  private dashboardInfo;
  private iframeUrl;
  private iframeSnippet;

  private refreshTimeSubscription$: Subscription;

  constructor(
    private grafanaService: GrafanaService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.initRefreshTimer();
  }

  ngOnDestroy() {
    if (this.subscriptions$) {
      this.subscriptions$.unsubscribe();
    }
    if (this.refreshTimeSubscription$) {
      this.refreshTimeSubscription$.unsubscribe();
    }
  }

  generateChart() {
    this.iframeUrl = "";
    console.log("button clicked!");
    console.log(this.timeRange.selection);

    this.subscriptions$.add(
      this.grafanaService
        .getChartIframe(
          this.options[0].selection,
          this.options[1].selection,
          this.title,
          this.timeRange.selection
        )
        .subscribe(
          (iframeUrl: any) => {
            console.log(iframeUrl);
            this.iframeUrl = iframeUrl;
            this.iframeSnippet = this.grafanaService.generateIFrameWithTimeStamp(
              this.iframeUrl,
              this.timeRange.selection
            );
            this.refreshTime = Date.now();
            this.visualContainer.nativeElement.innerHTML = this.iframeSnippet;
          },
          (error: any) => {
            console.log("error when generating grafana chart.");
            console.log(error);
          }
        )
    );
  }

  reloadIFrame() {
    if (this.iframeUrl) {
      console.log("reload iframe");
      this.iframeSnippet = this.grafanaService.generateIFrameWithTimeStamp(
        this.iframeUrl,
        this.timeRange.selection
      );
      this.visualContainer.nativeElement.innerHTML = this.iframeSnippet;
      this.refreshTime = Date.now();
    }
  }

  copyIFrame() {
    if (this.iframeSnippet) {
      navigator.clipboard.writeText(this.iframeSnippet).then(
        () => {
          console.log("Copying the clipboard was successful!");
          this.copied = true;
        },
        err => {
          console.error("Could not copy text: ", err);
          this.copied = false;
        }
      );
    }
  }

  onCopyMsgClose() {
    this.copied = false;
  }

  showDateTimePicker() {
    return Number(this.timeRange.selection) === -1;
  }

  initRefreshTimer() {
    const refreshTimeObservable = timer(0, 5000);
    this.refreshTimeSubscription$ = refreshTimeObservable.subscribe(() => {
      if (!this.refreshTime) {
        return;
      }
      const interval: number = Math.floor(
        Math.abs(Date.now() - this.refreshTime) / 60 / 1000
      );
      if (interval === 0) {
        this.refreshMessage = "Refreshed in less than 1 minute.";
      } else if (interval === 1) {
        this.refreshMessage = `Refresh in ${interval} min ago.`;
      } else {
        this.refreshMessage = `Refresh in ${interval} mins ago.`;
      }
    });
  }
}
