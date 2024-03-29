import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbs = [];

  // Build your breadcrumb starting with the root route of your current activated route
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(event => this.buildBreadCrumb(this.activatedRoute.root))
    ).subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });
  }

  ngOnInit() {
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
    // If no routeConfig is avalailable we are on the root path
    const label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : null;
    const path = route.routeConfig ? route.routeConfig.path : '';

    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    const nextUrl = `${url}${path}/`;
    const clickable = !path.includes(':id');
    const breadcrumb = { label, url: nextUrl, clickable };
    const newBreadcrumbs = [...breadcrumbs, breadcrumb];

    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }

}
