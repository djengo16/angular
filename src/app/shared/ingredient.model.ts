export class Ingredient {
  //shorcut for creating fields, we just need to add access modifiers
  //infront of the arguments
  constructor(public name: string, public amount: number) {
    this.name = name;
    this.amount = amount;
  }
}
