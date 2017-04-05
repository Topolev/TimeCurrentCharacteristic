import {Area, AreaTemplate} from "./area-template";

export class BuilderArea {
  public buildAreaByTemplate(areaTemplate: AreaTemplate): Area {
    var area: Area = new Area();
    area.xEnd = null;
    area.xStart = null;
    area.areaTemplate = areaTemplate;
    area.type = areaTemplate.type;
    if (area.type == 0){
      area.points = [];
    }
    if (area.type == 1 || area.type == 2) {
      area.fn = areaTemplate.fn;
      if (areaTemplate.variableDescriptions) {
        area.variables = [];
        for (let variable of areaTemplate.variableDescriptions) {
          area.variables[variable.label] = null;
        }
      }
    }
    return area;
  }
}
