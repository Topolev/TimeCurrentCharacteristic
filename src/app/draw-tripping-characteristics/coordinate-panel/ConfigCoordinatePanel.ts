export class ConfigCoordinatePanel {
  scale: number;
  scaleXInit: number;
  scaleYInit: number;
  maxScale: number;
  minScale: number;
  x0Offset: number;
  y0Offset: number;
  xStepGrid: number;
  yStepGrid: number;
  maxNumberWithinX: number;
  maxNumberWithinY: number;
  marginHorizontal: number;
  marginVertical: number;
  colorMainAxis: string;
  colorIntermediateAxis: string;
  font: string;
  choosenVoltage: number;
}
export var defaultConfig: ConfigCoordinatePanel = {
  scale: 1,
  scaleXInit: 1,
  scaleYInit: 100,
  maxScale: 5,
  minScale: 0.2,
  x0Offset: 0,
  y0Offset: 0,
  xStepGrid: 24,
  yStepGrid: 0.1,
  maxNumberWithinX: 12,
  maxNumberWithinY: 20,
  marginHorizontal: 50,
  marginVertical: 40,
  colorMainAxis: "red",
  colorIntermediateAxis: "rgba(0,0,0,0.1)",
  font: "14px Arial",
  choosenVoltage: undefined
}
