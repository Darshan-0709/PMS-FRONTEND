export interface Degree {
  degreeId: string;
  name: string;
}

export interface Branch {
  branchId: string;
  name: string;
}

export interface Domain {
  domainId: string;
  name: string;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}
