export class Exp {
  id: number;
  name: string;
  titleExp: string;
  dateStart: Date;
  dateEnd: Date;
  dateRelease: Date;
  imagesExp: string;
  imagesExpMob: string;
  location: string;
  descrip: string;
  path: string;
  status: string;
  type: string;
  urlTerms:string;

  stock: any;
  checkIn?: boolean = false;
  
  constructor(data?: any) {
    if (data !== undefined) {
      this.id = data["id"] !== undefined ? data["id"] : undefined;
      this.name = data["name"] !== undefined ? data["name"] : undefined;
      this.titleExp = data["titleExp"] !== undefined ? data["titleExp"] : undefined;
      this.dateStart = data["dateStart"] !== undefined ? data["dateStart"] : undefined;
      this.dateEnd = data["dateEnd"] !== undefined ? data["dateEnd"] : undefined;
      this.dateRelease = data["dateRelease"] !== undefined ? data["dateRelease"] : undefined;
      this.imagesExp = data["imagesExp"] !== undefined ? data["imagesExp"] : undefined;
      this.imagesExpMob = data["imagesExpMob"] !== undefined ? data["imagesExpMob"] : undefined;
      this.location = data["location"] !== undefined ? data["location"] : undefined;
      this.descrip = data["descrip"] !== undefined ? data["descrip"] : undefined;
      this.path = data["path"] !== undefined ? data["path"] : undefined;
      this.status = data["status"] !== undefined ? data["status"] : undefined;
      this.type = data["type"] !== undefined ? data["type"] : undefined;
      this.urlTerms = data["urlTerms"] !== undefined ? data["urlTerms"] : undefined;
      this.stock = data["stock"] !== undefined ? data["stock"] : undefined;
    }
  }

  static fromJS(data: any): Exp {
    return new Exp(data);
  }

  toJS(data?: any) {
    data = {};
    data["id"] = this.id !== undefined ? this.id : null;
    data["name"] = this.name !== undefined ? this.name : null;
    data["titleExp"] = this.titleExp !== undefined ? this.titleExp : null;
    data["dateStart"] = this.dateStart !== undefined ? this.dateStart : null;
    data["dateEnd"] = this.dateEnd !== undefined ? this.dateEnd : null;
    data["dateRelease"] = this.dateRelease !== undefined ? this.dateRelease : null;
    data["imagesExp"] = this.imagesExp !== undefined ? this.imagesExp : null;
    data["imagesExpMob"] = this.imagesExpMob !== undefined ? this.imagesExpMob : null;
    data["location"] = this.location !== undefined ? this.location : null;
    data["descrip"] = this.descrip !== undefined ? this.descrip : null;
    data["path"] = this.path !== undefined ? this.path : null;
    data["status"] = this.status !== undefined ? this.status : null;
    data["type"] = this.type !== undefined ? this.type : null;
    data["urlTerms"] = this.urlTerms !== undefined ? this.urlTerms : null;
    data["stock"] = this.stock !== undefined ? this.stock : null;

    return data;
  }

  toJSON() {
    return JSON.stringify(this.toJS());
  }
}
