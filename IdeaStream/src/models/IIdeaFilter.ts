export interface IIdeaFilter {
    categoryTitle: string;
    options: IIdeaFilterOption[]; 
}

export interface IIdeaFilterOption {
    filterTitle: string;
    queryString: string;
    returnCount?: number;
}