

export class CurrentSlice{
  label: string = '';
  current: number;
  constructor(current?: number, label?: string){
    this.current = current;
      if (label){
        this.label = label;
      }
  }
}
