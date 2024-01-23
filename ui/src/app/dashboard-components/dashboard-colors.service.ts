import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardColorsService {

  constructor() { }

  /**
   * Chart.js does not provide a default color palette, thus a custom color palette 
   * is created to return for use by all dashboard charts.
   * 
   * Visuals of colors saved in dashboard-colors.scss for quick reference/color preview
   */
  public chartTransparentColors(colorsRequired: number): string[] {
    const hexColorsArray: string[] = ["#ff9f40", "#4bc0c0", "#9966ff", "#36a2eb", "#ff4040", "#efff40", "#ff40df", "#40efff", "#40ff46", "#405dff", "#ff9939", "#6c6c6c", "#c3ff40", "#993a8c", "#519da5", "#ff71a0"];
    return hexColorsArray.slice(0, colorsRequired);
  };

  public chartOpaqueColors(colorsRequired: number): string[] {
    const hexColorsArray: string[] = ["#ff9f4033", "#4bc0c033", "#9966ff33", "#36a2eb33", "#ff404033", "#efff4033", "#ff40df33", "#40efff33", "#40ff4633", "#405dff33", "#ff993933", "#6c6c6c33", "#c3ff4033", "#993a8c33", "#519da533", "#ff71a033"];
    return hexColorsArray.slice(0, colorsRequired);
  };

}


