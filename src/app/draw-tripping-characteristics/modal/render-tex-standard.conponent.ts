declare var katex: any;
import {Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges} from "@angular/core";
@Component({
  selector: 'render-tex-standard',
  template: `<div #renderArea style="text-align:center;"></div>`
})
export class RenderTexStandardComponent implements AfterViewInit, OnChanges {


  @Input() expression: string;
  @ViewChild("renderArea") renderArea: ElementRef;

  ngAfterViewInit(): void {
    this.renderExpression(this.expression);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderExpression(changes.expression.currentValue);
  }

  renderExpression(expression: string){
    katex.render(expression, this.renderArea.nativeElement);
  }
}
